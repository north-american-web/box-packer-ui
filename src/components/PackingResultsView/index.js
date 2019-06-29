import React from 'react'
import PropTypes from "prop-types";
import {Panel, Toast} from "../Spectre";
import PackingResultsListView from '../PackingResultsListView/index';

function PackingResultsView({apiRequest, apiResponse}) {
    return (
        <Panel title='Last API Response'>
            <Toast status={apiResponse.success ? 'success' : 'error'}>
                The item(s) {!apiResponse.success && 'won\'t '}fit into the box(es)!
            </Toast>

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
    apiRequest: PropTypes.object.isRequired,
    apiResponse: PropTypes.object.isRequired
};

export default PackingResultsView;