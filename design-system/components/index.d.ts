// Augusto Pinto — tipos de los componentes (documentación). Global: window.AugustoPinto
import type * as React from 'react';
import type { Theme } from '@mui/material/styles';

export type Status = 'error' | 'success';
export type IconName = 'arrow-up-right' | 'arrow-right' | 'arrow-down' | 'chevron-down' | 'menu' | 'x' | 'check-circle' | 'alert-circle' | 'info' | 'mail' | 'terminal' | 'copy' | 'check';
export interface NavItem { label: string; href: string; current?: boolean }

export interface ProviderProps { children?: React.ReactNode; theme?: Theme }
export interface IconProps { name: IconName; size?: 'sm' | 'md' | 'lg'; label?: string; className?: string }
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary'; size?: 'md' | 'lg'; onDark?: boolean; loading?: boolean; fullWidth?: boolean; startIcon?: IconName; endIcon?: IconName; href?: string }
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { external?: boolean; onDark?: boolean; size?: 'sm' | 'md' | 'lg' }
export interface TagProps { children?: React.ReactNode; variant?: 'default' | 'inverse'; size?: 'sm' | 'md'; title?: string; className?: string }
export interface DividerProps { orientation?: 'horizontal' | 'vertical'; onDark?: boolean; className?: string }
export interface LogoProps { variant?: 'logotype' | 'monogram'; tone?: 'dark' | 'light'; height?: number; label?: string; decorative?: boolean; className?: string }
export interface FormFieldProps { label: string; helperText?: string; errorText?: string; successText?: string; optional?: boolean; id?: string; name?: string; type?: string; value?: string; defaultValue?: string; onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>; placeholder?: string; size?: 'sm' | 'md' | 'lg'; status?: Status; disabled?: boolean; readOnly?: boolean; required?: boolean; multiline?: boolean; rows?: number; autoComplete?: string; inputMode?: string; className?: string }
export interface NavBarProps { items: NavItem[]; actions?: NavItem[]; tone?: 'light' | 'dark'; menuPlacement?: 'up' | 'down'; label?: string; className?: string }
export interface SocialLinksProps { items: { label: string; href: string }[]; onDark?: boolean; layout?: 'row' | 'column'; className?: string }
export interface SkillGroupProps { title: string; skills: string[]; description?: string; className?: string }
export interface DiscoveryHintProps { children: React.ReactNode; shortcut?: string; onActivate?: () => void; tone?: 'light' | 'dark'; className?: string }
export interface HeroProps { name?: string; role?: string; location?: string; availability?: string; intro?: string; image?: string; imageAlt?: string; uppercase?: boolean; nav?: NavItem[]; navActions?: NavItem[]; hint?: React.ReactNode; height?: string; className?: string }
export interface SectionHeadlineProps { title: string; eyebrow?: string; lead?: string; id?: string; as?: 'h1' | 'h2' | 'h3'; onDark?: boolean; className?: string }
export interface ProjectLink { label: string; href: string; external?: boolean }
export interface ProjectCardProps { name: string; variant?: 'featured' | 'compact'; index?: number | string; year?: string; status?: string; role?: string; summary?: string; result?: string; stack?: string[]; links?: ProjectLink[]; image?: string; imageAlt?: string; reverse?: boolean; headingLevel?: 'h2' | 'h3' | 'h4'; className?: string }
export interface StoryTimelineProps { items: { period: string; title: string; description?: string }[]; className?: string }
export interface ContactFormProps { onSubmit?: (data: { name: string; email: string; message: string }) => Promise<void> | void; email?: string; className?: string }
export interface FooterProps { links?: { label: string; href: string }[]; note?: string; year?: string; className?: string }

export declare function Provider(p: ProviderProps): React.JSX.Element;
export declare function createApTheme(tokens?: Record<string, string>): Theme;
export declare function readTokens(el?: Element): Record<string, string>;
export declare const tokens: Record<string, string>;
export declare function Icon(p: IconProps): React.JSX.Element;
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
export declare function Tag(p: TagProps): React.JSX.Element;
export declare function Divider(p: DividerProps): React.JSX.Element;
export declare function Logo(p: LogoProps): React.JSX.Element;
export declare function FormField(p: FormFieldProps): React.JSX.Element;
export declare function NavBar(p: NavBarProps): React.JSX.Element;
export declare function SocialLinks(p: SocialLinksProps): React.JSX.Element;
export declare function SkillGroup(p: SkillGroupProps): React.JSX.Element;
export declare function DiscoveryHint(p: DiscoveryHintProps): React.JSX.Element;
export declare function Hero(p: HeroProps): React.JSX.Element;
export declare function SectionHeadline(p: SectionHeadlineProps): React.JSX.Element;
export declare function ProjectCard(p: ProjectCardProps): React.JSX.Element;
export declare function StoryTimeline(p: StoryTimelineProps): React.JSX.Element;
export declare function ContactForm(p: ContactFormProps): React.JSX.Element;
export declare function Footer(p: FooterProps): React.JSX.Element;
