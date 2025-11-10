import { useEffect, useState } from "react";

const CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const H_SPACING = 10;
const V_SPACING = 16;
const EXTRA_COLS = 24;
const EXTRA_ROWS = 12;

const MatrixText = () => {
    const [lines, setLines] = useState<string[]>([]);

    const randomChar = () => {
        return CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
    };

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const generateMatrix = () => {
            const cols = Math.ceil(window.innerWidth / H_SPACING) + EXTRA_COLS;
            const rows = Math.ceil(window.innerHeight / V_SPACING) + EXTRA_ROWS;
            const nextLines: string[] = [];

            for (let r = 0; r < rows; r++) {
                let line = "";
                for (let c = 0; c < cols; c++) {
                    line += randomChar();
                }
                nextLines.push(line);
            }

            setLines(nextLines);
        };

        generateMatrix();
        const handleResize = () => generateMatrix();
        window.addEventListener("resize", handleResize);
        const interval = window.setInterval(generateMatrix, 600);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="matrix-bg" aria-hidden="true">
            {lines.map((line, i) => (
                <div key={`matrix-line-${i}`}>{line}</div>
            ))}
        </div>
    );
};

export default MatrixText;
