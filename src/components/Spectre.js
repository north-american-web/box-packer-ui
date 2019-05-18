import React from 'react'

export function Panel({title, footer, children}){
    return (
        <div className="panel">
            <div className="panel-header">
                <div className="panel-title">{title}</div>
            </div>
            <div className="panel-body">
                {children}
            </div>
            <div className="panel-footer">
                {footer}
            </div>
        </div>
    )
}

export function Toast({status, children}){
    return <div className={`toast toast-${status}`}>{children}</div>
}

export function Bar({ indicatorClasses, percent }){
    return (
        <div className="bar bar-sm">
            <div
                className={indicatorClasses}
                role="progressbar"
                style={{width: `${percent}%`}}
                aria-valuenow={percent} aria-valuemin="0"
                aria-valuemax="100"
            />
        </div>
    )
}