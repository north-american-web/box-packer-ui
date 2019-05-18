import React from 'react'
import {SolidPreview} from "./Solid";
import PropTypes from "prop-types";
import {Bar, Panel, Toast} from "./Spectre";

function PackingResultsSegment({ title, solids }){
    return (
        <>
            <h6>{title}</h6>
            <ul>
                {solids.map((solid, index) => (
                    <li key={index}>
                        <SolidPreview fallbackDescription='Box' solid={solid}>
                            {solid.hasOwnProperty('contents') && solid.contents.map((item, index) => (
                                <SolidPreview key={index} fallbackDescription='Item' solid={item}/>
                            ))}
                        </SolidPreview>
                    </li>
                ))}
                {solids.length === 0 && (
                    <p className="text-gray">Nothing here.</p>
                )}
            </ul>
        </>
    )
}

PackingResultsSegment.propTypes = {
    title: PropTypes.string.isRequired,
    solids: PropTypes.array.isRequired
}

export function PackingResults({success, packed = [], empty = [], leftOverItems = []}) {
    return (
        <Panel title='Results'>
            <Toast status={success ? 'success' : 'error'}>
                The item(s) {success ? '' : 'won\'t'} fit into the box(es)!
            </Toast>

            <div className="columns mt-2">
                <div className="column col-md-12 col-4">
                    <PackingResultsSegment
                        title='Packed boxes'
                        solids={packed}
                    />
                </div>

                <div className="column col-md-12 col-4">
                    <PackingResultsSegment
                        title='Empty boxes'
                        solids={empty}
                    />
                </div>

                <div className="column col-md-12 col-4">
                    <PackingResultsSegment
                        title='Left-over items'
                        solids={leftOverItems}
                    />
                </div>
            </div>
        </Panel>
    )
}

PackingResults.propTypes = {
    success: PropTypes.bool.isRequired,
    packed: PropTypes.array,
    empty: PropTypes.array,
    leftOverItems: PropTypes.array
}

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