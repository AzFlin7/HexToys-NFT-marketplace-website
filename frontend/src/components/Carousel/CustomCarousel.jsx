import React, {useEffect, useState} from 'react';
import './style.scss';
import {Carousel} from "react-configurable-carousel";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';

const CustomCarousel = (props) => {
    const [items, setItems] = useState([]);
    const usetheme = useTheme();
    const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));
    useEffect(() => {
        setItems(props.items);
    }, [props]);


    return (
        <div className="custom-carousel-container">
            <Carousel
                arrows={true}
                width={"100%"}
                height={isMobileOrTablet ? 'auto' : "600px"}
                carouselStyle={"3d"}
                autoScrollInterval={3000}
                children={items.map((item, index) => (
                    <div key={index}>{item.content}</div>
                ))}
            >
            </Carousel>
        </div>
    )
}

export default CustomCarousel;