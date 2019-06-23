import React from 'react'
import PropTypes from "prop-types";
import {Panel, Toast} from "../Spectre";
import PackingResultsListView from '../PackingResultsListView/index';

function PackingResultsView({success, packed = [], empty = [], leftOverItems = [], apiRequest, apiResponse}) {
    return (
        <Panel title='API Response'>
            <Toast status={success ? 'success' : 'error'}>
                The item(s) {!success && 'won\'t '}fit into the box(es)!
            </Toast>

            <div className="columns mt-2">
                <div className="column col-md-12 col-4">
                    <PackingResultsListView
                        title='Packed boxes'
                        solids={packed}
                    />
                </div>

                <div className="column col-md-12 col-4">
                    <PackingResultsListView
                        title='Empty boxes'
                        solids={empty}
                    />
                </div>

                <div className="column col-md-12 col-4">
                    <PackingResultsListView
                        title='Left-over items'
                        solids={leftOverItems}
                        fallbackDescription='Item'
                    />
                </div>
            </div>

            <h6>Request JSON</h6>
            <pre className="code" data-lang='JSON'><code>{apiRequest}</code></pre>

            <h6>Response JSON</h6>
            <pre className="code" data-lang='JSON'><code>{apiResponse}</code></pre>
        </Panel>
    )
}

PackingResultsView.propTypes = {
    success: PropTypes.bool.isRequired,
    packed: PropTypes.array,
    empty: PropTypes.array,
    leftOverItems: PropTypes.array,
    apiRequest: PropTypes.string.isRequired,
    apiResponse: PropTypes.string.isRequired
}

export default PackingResultsView;