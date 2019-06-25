import React from 'react'

export function Panel({title, footer, children}){
    return (
        <div className="panel mt-2">
            { title && (
                <div className="panel-header">
                    <div role='heading' className="panel-title">{title}</div>
                </div>
            )}
            <div data-testid="panel-body" className="panel-body">
                {children}
            </div>
            <div data-testid="panel-footer" className="panel-footer">
                {footer}
            </div>
        </div>
    )
}

export function Toast({status, children}){
    return <div data-testid="toast-element" className={`toast toast-${status}`}>{children}</div>
}

export function Bar({ indicatorClasses, percent }){
    return (
        <div className="bar bar-sm">
            <div data-testid='bar-element'
                className={indicatorClasses}
                role="progressbar"
                style={{width: `${percent}%`}}
                aria-valuenow={percent} aria-valuemin="0"
                aria-valuemax="100"
            />
        </div>
    )
}