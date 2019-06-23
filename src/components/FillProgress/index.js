import PropTypes from "prop-types";
import React from "react";
import {Bar, Toast} from "../Spectre";

export function FillProgress({percent}) {
    const classNameExtra = percent > 100
        ? 'bg-error'
        : percent > 90 ? 'bg-warning' : ''

    return (
        <>
            <Bar percent={percent} indicatorClasses={classNameExtra} />
            { percent > 100 && (
                <Toast status='error'>
                    The volume of the items exceeds the volume of the container(s). The packing algorithm will not be run.
                </Toast>
            )}
        </>
    )
}

FillProgress.propTypes = {
    percent: PropTypes.number.isRequired
}