import React from 'react';

type Props = { children: React.ReactNode[] | React.ReactNode; isLast?: boolean };

export default function ButtonsBlock({ children, isLast }: Props) {
    return (
        <div className="btn-block">
            {children}
            {!isLast ? <div className="line-separator"></div> : null}
        </div>
    );
}
