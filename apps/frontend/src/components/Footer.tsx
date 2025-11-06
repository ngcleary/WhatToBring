import React from 'react';
import {Link} from "react-router-dom";

interface FooterTextProps {
    children: React.ReactNode;
    className?: string;
}

const FooterText = ({ children, className = '' }: FooterTextProps) => (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

const Footer = () => {
    return (
        <footer className="bg-primary w-full border-t border-border text-foreground py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
                <FooterText className="mb-3 font-trade text-white">
                    This is a personal website under ongoing development.
                </FooterText>

                <FooterText className="mb-3 text-white">
                    <span>For more information contact Nora Cleary:</span>

                </FooterText>
                <FooterText>
                    <a
                        href="www.linkedin.com/in/nora-cleary"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline font-semibold"
                    >
                        LinkedIn {' '}
                    </a>
                     | {' '}
                    <a
                        href="noracleary@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline font-semibold"
                    >
                        noracleary@gmail.com
                    </a>
                </FooterText>
            </div>
        </footer>
    );
};

export default Footer;