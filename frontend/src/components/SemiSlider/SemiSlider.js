import './style.scss'
import {useContext, useEffect, useRef, useState} from "react";
import ThemeContext from "../../context/ThemeContext";

export default function SemiSlider(props) {
    const {theme} = useContext(ThemeContext);

    const red = "#ff6261";
    const orange = "#ff893c";
    const circleRef = useRef(null);
    const textScoreRef = useRef(null);
    const textStatusRef = useRef(null);
    const arcRef1 = useRef(null);
    const arcRef2 = useRef(null);

    const [score, setScore] = useState(0);

    let arcWidth = window.innerWidth > 500 ? 200 : 120;
    let arcCenterX = window.innerWidth > 500 ? 250 : 150;
    let arcCenterY = window.innerWidth > 500 ? 223 : 173;
    let svgWidth = window.innerWidth > 500 ? 500 : 300;
    let svgHeight = window.innerWidth > 500 ? 223 : 173;
    let pointerSize = window.innerWidth > 500 ? 74 : 74;
    let strokeWidth = 46;
    let min = 0;
    let max = 100;
    let range = max - min;
    let span1 = 20;
    let span2 = 40;
    let span3 = 60;
    let span4 = 80;
    let scoreColor;
    let margin = 3;
    let scoreText = "";
    // var arc0 = document.getElementById("arc0");
    let arc1 = document.getElementById("arc1");
    let arc2 = document.getElementById("arc2");
    let arc3 = document.getElementById("arc3");
    let arc4 = document.getElementById("arc4");
    let arc5 = document.getElementById("arc5");
    let statusFillColor = theme === 'light' ? '#000': '#fff';
    let scoreFillColor = theme === 'light' ? 'rgba(0, 0, 0, 0.60)': 'rgba(255, 255, 255, 0.60)';

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees-180) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle){

        let start = polarToCartesian(x, y, radius, endAngle);
        let end = polarToCartesian(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        let d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }

    function moveCircle(x, y, radius, endAngle, color) {
        let start = polarToCartesian(x, y, radius, endAngle);

        if (endAngle >= 0 || endAngle <= 180) {
            circleRef.current.setAttribute("x", start.x - pointerSize / 2);
            circleRef.current.setAttribute("y", start.y - pointerSize / 2);

            textScoreRef.current.innerHTML = 'Locked: <tspan font-weight="bold">#3,351</tspan>';
            textStatusRef.current.innerHTML = props.value + '%';
        } else {
            circleRef.current.style.display = "none";
        }

    }

    function filterRange(r) {

        r = r - min;
        r = Math.round(r / range * 180);
        return r;

    }

    function alterArc(arc, color, start, end) {

        arc.setAttribute("d", describeArc(arcCenterX, arcCenterY, arcWidth, start, end));
        // arc.setAttribute("stroke", color);
        arc.setAttribute("stroke-width", strokeWidth);

    }



    useEffect(() => {
        setScore(props.value);
        let score = filterRange(props.value);

        span1 = filterRange(props.value);
        span2 = filterRange(100);

        let range1S = margin;
        let range1E = span1 - margin;
        let range2S = span1 + margin;
        let range2E = span2 - margin;

        moveCircle(arcCenterX, arcCenterY, arcWidth, score, scoreColor);

        // alterArc(arc0, "black", 0, 180)
        alterArc(arcRef1.current, red, range1S, range1E)
        alterArc(arcRef2.current, orange, range2S, range2E)
    }, [props])





    return (
        <div className={"semi-slider-container " + theme}>
            <svg height={svgHeight} width={svgWidth}>
                <linearGradient id="paint0_linear_305_1634" x1="181.181" y1="393.92" x2="201.608" y2="0.937628" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FC01F8"/>
                    <stop offset="1" stop-color="#FA4D24"/>
                </linearGradient>

                <path id="arc1" ref={arcRef1} fill="none" stroke="url(#paint0_linear_305_1634)" stroke-linecap="round" />
                <path id="arc2" ref={arcRef2} fill="none" stroke="#D9D9D9" stroke-linecap="round" />
                <svg xmlns="http://www.w3.org/2000/svg" width={pointerSize} height={pointerSize} viewBox={"0 0 " + pointerSize + " " + pointerSize} fill="none" ref={circleRef}>
                    <g filter="url(#filter0_b_305_1635)">
                        <circle cx="36.9204" cy="36.9203" r="36.3714" transform="rotate(-87.0244 36.9204 36.9203)" fill="url(#paint0_linear_305_1635)"/>
                        <circle cx="36.9204" cy="36.9203" r="28.8314" transform="rotate(-87.0244 36.9204 36.9203)" stroke="white" stroke-opacity="0.6" stroke-width="15.08"/>
                    </g>
                    <defs>
                        <filter id="filter0_b_305_1635" x="-9.9168" y="-9.91668" width="93.6744" height="93.674" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feGaussianBlur in="BackgroundImageFix" stdDeviation="5.23233"/>
                            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_305_1635"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_305_1635" result="shape"/>
                        </filter>
                        <linearGradient id="paint0_linear_305_1635" x1="0.548977" y1="35.9373" x2="73.2919" y2="35.9373" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FC01F8"/>
                            <stop offset="1" stop-color="#FA4D24"/>
                        </linearGradient>
                    </defs>
                </svg>
                <text id="score" ref={textScoreRef} x="50%" y="95%" fill={scoreFillColor} dominant-baseline="middle" text-anchor="middle"></text>
                <text id="status" ref={textStatusRef} x="50%" y="78%" fill={statusFillColor} dominant-baseline="middle" text-anchor="middle"></text>
            </svg>
        </div>
    )
}