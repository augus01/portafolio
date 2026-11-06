import { Icon } from '../Icon';

// Enlace para seguir con un agente en la oficina (recepción en Contacto, stack en la ficha de una tecnología, arquitecto
// en su plano): una sola píldora para los tres, con el color del agente de fondo, letras blancas y borde negro.
// `agent` es 'recepcion', 'stack' o 'arquitecto'; el resto de las props van al <a> (href, onClick…).
export function AgentLink({ agent, className, children, ...rest }) {
  return (
    <a className={['ap-agl', 'label', className].filter(Boolean).join(' ')} data-agent={agent} {...rest}>
      {children}
      <Icon name="arrow-right" size="sm" />
    </a>
  );
}
