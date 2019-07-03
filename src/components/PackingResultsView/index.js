import React from 'react'
import PropTypes from "prop-types";
import {Panel} from "../Spectre";

export const PackingResultsListView = ({ title, solids, fallbackDescription = 'Box' }) => {
    return (
        <>
            <h6 data-testid="packing-results-list-view__title">{title}</h6>
            {solids.length === 0
                ? (
                    <p data-testid="packing-results-list-view__contents" className="text-gray">Nothing here.</p>
                )
                : (
                    <ul data-testid="packing-results-list-view__contents">
                        {solids.map((solid, index) => (
                            <li key={index}>
                                <SolidView fallbackDescription={fallbackDescription} solid={solid} />
                            </li>
                        ))}
                    </ul>
                )}
        </>
    )
};
PackingResultsListView.propTypes = {
    title: PropTypes.string.isRequired,
    solids: PropTypes.array.isRequired
};

export const SolidView = ({ solid, fallbackDescription, isChild }) => {
    const description = solid.description ? solid.description : fallbackDescription;
    return (
        <>
            <span className="solid-view__description">
                <span role="img" aria-label="" className='solid-view__description-icon'>{ isChild ? '👝' : '📦' }</span>
                {description}</span>
            <span className="solid-view__dimensions">({solid.width}x{solid.length}x{solid.height})</span>
            {solid.hasOwnProperty('contents') && solid.contents.length > 0 && (
                <ul className="solid-view__children">
                    {solid.contents.map( (child, index) => (
                        <li key={index}>
                            <SolidView fallbackDescription="Item" solid={child} isChild={true} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
};
SolidView.propTypes = {
    solid: PropTypes.object.isRequired,
    fallbackDescription: PropTypes.string.isRequired,
    children: PropTypes.array,
    isChild: PropTypes.bool,
};

function PackingResultsView({apiLoadingTime, apiRequest, apiResponse}) {
    return (
        <Panel title={(
            <>
                Last API Response <small>(Fetched in <span data-testid="loading-time">{apiLoadingTime}</span>ms)</small>
            </>
        )}>
            <div className="columns mt-2">
                <div className="column col-md-12 col-4">
                    <PackingResultsListView
                        title='Packed boxes'
                        solids={apiResponse.packed}
                    />
                </div>

                <div className="column col-md-12 col-4">
                    <PackingResultsListView
                        title='Empty boxes'
                        solids={apiResponse.empty}
                    />
                </div>

                <div className="column col-md-12 col-4">
                    <PackingResultsListView
                        title='Left-over items'
                        solids={apiResponse.leftOverItems}
                        fallbackDescription='Item'
                    />
                </div>
            </div>

            <div className="columns mt-2">
                <div className="column col-md-12 col-6">
                    <h6>Request JSON</h6>
                    <pre className="code" data-lang='JSON'><code
                        data-testid="request-json">{JSON.stringify(apiRequest, null, 2)}</code></pre>
                </div>
                <div className="column col-md-12 col-6">
                    <h6>Response JSON</h6>
                    <pre className="code" data-lang='JSON'><code
                        data-testid="response-json">{JSON.stringify(apiResponse, null, 2)}</code></pre>
                </div>
            </div>
        </Panel>
    )
}

PackingResultsView.propTypes = {
    apiLoadingTime: PropTypes.number.isRequired,
    apiRequest: PropTypes.object.isRequired,
    apiResponse: PropTypes.object.isRequired
};

export default PackingResultsView;