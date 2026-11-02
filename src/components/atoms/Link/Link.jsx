import { Icon } from '../Icon';

// Enlace de texto subrayado (design-system/components/Link). `external` abre en otra pestaña y lo anuncia.
export function Link({ href, external, size = 'md', onDark, className, children, ...rest }) {
  const cls = ['ap-link', size === 'sm' ? 'body-sm' : size === 'lg' ? 'body-lg' : 'body', onDark && 'ap-link--on-dark', className].filter(Boolean).join(' ');
  return (
    <a
      className={cls}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
      {external && (
        <>
          <Icon name="arrow-up-right" size="sm" className="ap-link__ext" />
          <span className="ap-sr"> (abre en otra pestaña)</span>
        </>
      )}
    </a>
  );
}
