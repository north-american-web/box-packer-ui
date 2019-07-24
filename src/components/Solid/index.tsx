import PropTypes from "prop-types";
import React from "react";

export interface SolidInterface {
    width: number|null;
    length: number|null;
    height: number|null;
    description?: string;
}

export interface ContainerSolidInterface extends SolidInterface {
    contents?: SolidInterface[];
}

interface SolidViewProps {
    solid: ContainerSolidInterface;
    fallbackDescription: string;
    isChild?: boolean;
}

export const SolidView = ({ solid, fallbackDescription, isChild = false }: SolidViewProps) => {
    const description = solid.description || fallbackDescription;
    return (
        <>
            <span className="solid-view__description">
                <span role="img" aria-label="" className='solid-view__description-icon'>{ isChild ? '👝' : '📦' }</span>
                {description}</span>
            <span className="solid-view__dimensions">({solid.width}x{solid.length}x{solid.height})</span>
            {solid.contents && solid.contents.length > 0 && (
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

export const makeEmptySolid = (): SolidInterface => ({width: null, length: null, height: null});

export const isSolidEmpty = (solid: SolidInterface) => {
    return !solid.width && !solid.length && !solid.height && !solid.description;
};
