import PropTypes from "prop-types";
import React from 'react';

const SolidView = ({ solid, fallbackDescription }) => {
    const description = solid.description ? solid.description : fallbackDescription;
    return (
        <>
            <span className="solid-view__description">{description}</span>
            <span className="solid-view__dimensions">({solid.width}x{solid.length}x{solid.height})</span>
            {solid.hasOwnProperty('contents') && (
                <ul className="solid-preview__children">
                    {solid.contents.map( (child, index) => (
                        <li key={index}>
                            <SolidView fallbackDescription="Item" solid={child} />
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
    children: PropTypes.array
};

export default SolidView;