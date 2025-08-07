import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Card = ({ title, subtitle, icon, className, children, footer }: CardProps) => {
  return (
    <div className={`card overflow-hidden ${className || ''}`}>
      {(title || subtitle) && (
        <div className="flex items-start p-4 border-b border-neutral-200 dark:border-neutral-700">
          {icon && <div className="mr-3 text-primary-500">{icon}</div>}
          <div>
            {title && <h3 className="font-medium text-neutral-900 dark:text-neutral-50">{title}</h3>}
            {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
          </div>
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;