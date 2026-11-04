<#
  Abre el portafolio en un Chrome aparte con recursos limitados, para ver cómo se comporta en un equipo modesto.

  - Es otra instancia de Chrome, con un perfil temporal propio: tu Chrome de siempre, tus pestañas y tu perfil no se tocan.
  - Toda esa instancia (y cada proceso que abra) queda en un "job" de Windows con un tope de memoria (-RamMB).
    Si una pestaña pasa el tope, Chrome la cierra con "Sin memoria": eso es parte de la prueba.
  - Cada pestaña tiene un tope de memoria de JavaScript y hay como máximo dos procesos de pestañas. Con -SinGpu, sin
    aceleración gráfica (WebGL por software), que es lo que hace que el sitio baje solo al modo liviano (src/lib/perfTier.js).
  - -AndroidGamaBaja suma el modo de Chrome para teléfonos de 1 GB o menos: pinta con colores de 16 bits, así que se
    ven bordes entre bloques y degradados en escalones. Es propio de ese modo (Chrome de escritorio no lo usa), no del sitio.
  - -Cpu N hace el procesador N veces más lento en cada pestaña de esa instancia (lo mismo que "CPU slowdown" de
    DevTools), con el ayudante scripts/chrome-freno-cpu.mjs (necesita Node, el mismo del proyecto).
  - -Perfil fija todo de una vez para imitar un equipo:
      8GB  notebook de 8 GB con gráficos integrados y procesador de gama media (Core i5 / Ryzen 5 de hace unos años):
           3 GB para Chrome, 4 procesos de pestañas, 512 MB de JavaScript por pestaña, CPU 3x más lento, con GPU.
      4GB  notebook básico de 4 GB (Celeron / Core i3 antiguo): 1 GB para Chrome, 2 procesos, 256 MB por pestaña,
           CPU 6x más lento y sin GPU.
    Lo que pases a mano (-RamMB, -Cpu, -SinGpu) manda sobre el perfil.
  - No cambia nada del sistema. Al cerrar esa ventana termina todo y el perfil temporal se borra: vuelve a la normalidad.

  Uso (con `npm run dev` o `npm run preview` corriendo):
    powershell -ExecutionPolicy Bypass -File scripts/chrome-bajo-recursos.ps1
    powershell -ExecutionPolicy Bypass -File scripts/chrome-bajo-recursos.ps1 -RamMB 768 -SinGpu -Url http://localhost:4173/
    powershell -ExecutionPolicy Bypass -File scripts/chrome-bajo-recursos.ps1 -RamMB 512 -AndroidGamaBaja
    powershell -ExecutionPolicy Bypass -File scripts/chrome-bajo-recursos.ps1 -Perfil 8GB
#>
param(
  [string]$Url = 'http://localhost:5173/',
  [ValidateSet('', '8GB', '4GB')][string]$Perfil = '',
  [int]$RamMB = 0,
  [int]$Cpu = 0,
  [switch]$SinGpu,
  [switch]$AndroidGamaBaja
)

# Perfiles de equipo: memoria para Chrome, procesos de pestañas, memoria de JavaScript por pestaña, lentitud del CPU y GPU.
$perfiles = @{
  ''    = @{ Ram = 1024; Procesos = 2; Js = 256; Cpu = 1; SinGpu = $false }
  '8GB' = @{ Ram = 3072; Procesos = 4; Js = 512; Cpu = 3; SinGpu = $false }
  '4GB' = @{ Ram = 1024; Procesos = 2; Js = 256; Cpu = 6; SinGpu = $true }
}
$p = $perfiles[$Perfil]
if ($RamMB -le 0) { $RamMB = $p.Ram }
if ($Cpu -le 0) { $Cpu = $p.Cpu }
if (-not $SinGpu -and $p.SinGpu) { $SinGpu = [switch]$true }

$ErrorActionPreference = 'Stop'

$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw 'No encontré chrome.exe.' }

# Job de Windows con tope de memoria para todos los procesos de esta instancia (los hijos lo heredan).
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class ApJob {
  [StructLayout(LayoutKind.Sequential)] struct BASIC { public long a, b; public uint LimitFlags; public UIntPtr c, d; public uint e; public UIntPtr f; public uint g, h; }
  [StructLayout(LayoutKind.Sequential)] struct IO { public ulong a, b, c, d, e, f; }
  [StructLayout(LayoutKind.Sequential)] struct EXT { public BASIC Basic; public IO Io; public UIntPtr ProcessMemoryLimit, JobMemoryLimit, PeakProcess, PeakJob; }
  [DllImport("kernel32.dll", SetLastError = true)] static extern IntPtr CreateJobObject(IntPtr a, string n);
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool SetInformationJobObject(IntPtr j, int c, ref EXT i, uint l);
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool AssignProcessToJobObject(IntPtr j, IntPtr p);
  public static IntPtr Create(ulong bytes) {
    IntPtr job = CreateJobObject(IntPtr.Zero, null);
    EXT info = new EXT();
    // 0x200 = JOB_OBJECT_LIMIT_JOB_MEMORY; 0x2000 = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE (al cerrar el script, se cierra todo).
    info.Basic.LimitFlags = 0x200 | 0x2000;
    info.JobMemoryLimit = new UIntPtr(bytes);
    if (!SetInformationJobObject(job, 9, ref info, (uint)Marshal.SizeOf(typeof(EXT)))) throw new System.ComponentModel.Win32Exception();
    return job;
  }
  public static void Assign(IntPtr job, IntPtr proc) { if (!AssignProcessToJobObject(job, proc)) throw new System.ComponentModel.Win32Exception(); }
}
'@

$perfil = Join-Path $env:TEMP ("chrome-bajo-recursos-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
$flags = @(
  "--user-data-dir=`"$perfil`"",
  '--no-first-run', '--no-default-browser-check',
  "--renderer-process-limit=$($p.Procesos)",
  "--js-flags=--max-old-space-size=$($p.Js)",
  '--new-window'
)
if ($SinGpu) { $flags += '--disable-gpu' }
if ($AndroidGamaBaja) { $flags += '--enable-low-end-device-mode' }
# Para frenar el CPU se habla con Chrome por su puerto de depuración, solo en esta máquina y solo en esta instancia.
$puerto = 9400 + (Get-Random -Maximum 500)
if ($Cpu -gt 1) { $flags += "--remote-debugging-port=$puerto" }
$flags += $Url

$job = [ApJob]::Create([uint64]$RamMB * 1MB)
$proc = Start-Process -FilePath $chrome -ArgumentList $flags -PassThru
[ApJob]::Assign($job, $proc.Handle)

# CPU más lento en las pestañas (Emulation.setCPUThrottlingRate) con el ayudante de Node, que se queda conectado mientras
# dure la prueba: al cerrar Chrome se desconecta y todo vuelve a la velocidad normal.
$freno = $null
if ($Cpu -gt 1) {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if ($node) {
    $freno = Start-Process -FilePath $node.Source -ArgumentList "`"$PSScriptRoot\chrome-freno-cpu.mjs`"", $puerto, $Cpu -PassThru -NoNewWindow
  } else {
    Write-Host "No encontré Node para frenar el CPU: usa DevTools > Performance > CPU ${Cpu}x slowdown."
  }
}

$nombre = if ($Perfil) { "equipo de $Perfil" } else { 'recursos limitados' }
Write-Host "Chrome ($nombre): $RamMB MB, $($p.Procesos) procesos de pestañas, CPU $(if ($Cpu -gt 1) { "${Cpu}x más lento" } else { 'normal' }), $(if ($SinGpu) { 'sin GPU' } else { 'con GPU' })$(if ($AndroidGamaBaja) { ', modo Android de gama baja' }). Abierto en $Url"
Write-Host 'Cierra esa ventana de Chrome (o esta consola) para terminar; tu Chrome normal sigue igual.'
try { $proc.WaitForExit() } finally {
  if ($freno -and -not $freno.HasExited) { Stop-Process -Id $freno.Id -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Milliseconds 500
  Remove-Item -Recurse -Force $perfil -ErrorAction SilentlyContinue
  Write-Host 'Listo: perfil temporal borrado.'
}
