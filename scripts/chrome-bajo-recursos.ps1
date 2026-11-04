<#
  Abre el portafolio en un Chrome aparte con recursos limitados, para ver cómo se comporta en un equipo modesto.

  - Es otra instancia de Chrome, con un perfil temporal propio: tu Chrome de siempre, tus pestañas y tu perfil no se tocan.
  - Toda esa instancia (y cada proceso que abra) queda en un "job" de Windows con un tope de memoria (-RamMB).
    Si una pestaña pasa el tope, Chrome la cierra con "Sin memoria": eso es parte de la prueba.
  - Chrome arranca en modo de equipo de gama baja y, con -SinGpu, sin aceleración gráfica (WebGL por software),
    que es lo que hace que el sitio baje solo al modo liviano (src/lib/perfTier.js).
  - No cambia nada del sistema. Al cerrar esa ventana termina todo y el perfil temporal se borra: vuelve a la normalidad.

  Uso (con `npm run dev` o `npm run preview` corriendo):
    powershell -ExecutionPolicy Bypass -File scripts/chrome-bajo-recursos.ps1
    powershell -ExecutionPolicy Bypass -File scripts/chrome-bajo-recursos.ps1 -RamMB 768 -SinGpu -Url http://localhost:4173/
#>
param(
  [string]$Url = 'http://localhost:5173/',
  [int]$RamMB = 1024,
  [switch]$SinGpu
)

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
  '--enable-low-end-device-mode',
  '--renderer-process-limit=2',
  '--js-flags=--max-old-space-size=256',
  '--new-window'
)
if ($SinGpu) { $flags += '--disable-gpu' }
$flags += $Url

$job = [ApJob]::Create([uint64]$RamMB * 1MB)
$proc = Start-Process -FilePath $chrome -ArgumentList $flags -PassThru
[ApJob]::Assign($job, $proc.Handle)

Write-Host "Chrome limitado a $RamMB MB abierto en $Url$(if ($SinGpu) { ' (sin GPU)' })."
Write-Host 'Cierra esa ventana de Chrome (o esta consola) para terminar; tu Chrome normal sigue igual.'
try { $proc.WaitForExit() } finally {
  Start-Sleep -Milliseconds 500
  Remove-Item -Recurse -Force $perfil -ErrorAction SilentlyContinue
  Write-Host 'Listo: perfil temporal borrado.'
}
