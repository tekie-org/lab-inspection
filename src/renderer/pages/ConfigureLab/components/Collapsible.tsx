/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/require-default-props */
import React, { useEffect, useRef, useState } from 'react';
import Arrow from '../../../assets/Vector.svg';

interface IProps {
  open?: boolean;
  header: string | React.ReactNode;
  headerClassName?: string;
  titleClassName?: string;
  iconButtonClassName?: string;
  contentClassName?: string;
  contentContainerClassName?: string;
  collapsibleClassName?: string;
  children: React.ReactNode;
}

const Collapsible: React.FC<IProps> = ({
  open,
  collapsibleClassName = 'collapsible-card-edonec',
  headerClassName = 'collapsible-header-edonec',
  titleClassName = 'title-text-edonec',
  iconButtonClassName = 'collapsible-icon-button-edonec',
  contentClassName = 'collapsible-content-edonec',
  contentContainerClassName = 'collapsible-content-padding-edonec',
  children,
  header,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [height, setHeight] = useState<number | undefined>(
    open ? undefined : 0
  );
  const ref = useRef<HTMLDivElement>(null);
  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
  };
  useEffect(() => {
    if (!height || !isOpen || !ref.current) return undefined;
    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height);
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [height, isOpen]);
  useEffect(() => {
    if (isOpen) setHeight(ref.current?.getBoundingClientRect().height);
    else setHeight(0);
  }, [isOpen]);
  return (
    <>
      <div className={collapsibleClassName}>
        <div>
          <div className={headerClassName} onClick={handleFilterOpening}>
            <div className={titleClassName}>{header}</div>
            <button type="button" className={iconButtonClassName}>
              <img
                className={`${
                  isOpen
                    ? 'rotate-center-edonec down'
                    : 'rotate-center-edonec up'
                }`}
                alt="ss"
                src={Arrow}
              />
            </button>
          </div>
        </div>
        <div className={contentClassName} style={{ height }}>
          <div ref={ref}>
            <div className={contentContainerClassName}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collapsible;
