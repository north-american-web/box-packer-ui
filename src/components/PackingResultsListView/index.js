import PropTypes from "prop-types";
import React from 'react';
import SolidView from '../SolidView';

const PackingResultsListView = ({ title, solids, fallbackDescription = 'Box' }) => {
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

export default PackingResultsListView;