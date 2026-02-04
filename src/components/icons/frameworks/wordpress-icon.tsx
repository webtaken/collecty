"use client";
import type { SVGProps } from "react";

const WordPressIcon = (props: SVGProps<SVGSVGElement>) => (
    <img
        src="https://cdn.simpleicons.org/wordpress"
        alt="WordPress"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
    />
);

export { WordPressIcon };
