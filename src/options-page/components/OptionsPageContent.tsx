import { Box, Container, Paper, Stack, Toolbar, Typography } from "@mui/material";
import React, { FC, useEffect, useRef } from "react";
import { OptionsPageSection, useOptionsPageContext } from "./OptionsPage";

const SCROLL_OFFSET = 88; // AppBarと余白の分

const SectionRoot: FC<{ section: OptionsPageSection }> = (props) => {
    const context = useOptionsPageContext();

    const elem = useRef<HTMLElement>();

    useEffect(() => {
        const listener = () => {
            if (elem.current && context.currentSection !== props.section.id) {
                const scroll = window.scrollY - elem.current.offsetTop + SCROLL_OFFSET;
                if (0 <= scroll && scroll < elem.current.offsetHeight) {
                    context.setCurrentSection(props.section.id);
                }
            }
        };
        document.addEventListener("scroll", listener);
        return () => {
            document.removeEventListener("scroll", listener);
        };
    }, [context, props.section.id]);

    useEffect(() => {
        if (context.userSelectedSection === props.section.id) {
            if (elem.current) {
                window.scrollTo({ top: elem.current.offsetTop - SCROLL_OFFSET });
                context.setUserSelectedSection(null);
            }
        }
    }, [context, props.section.id]);

    return (
        <Box
            id={`section-${props.section.id}`}
            ref={elem}
            sx={{
                "&:last-child > .MuiPaper-root": {
                    marginBottom: "calc(100vh - 100% - 30px)",
                },
            }}
        >
            <Typography variant="h6">{browser.i18n.getMessage(props.section.title)}</Typography>
            <Paper>
                <props.section.Component />
            </Paper>
        </Box>
    );
};

export type OptionsPageContentProps = {
    sections: OptionsPageSection[];
    drawerWidth: number;
};

export const OptionsPageContent: FC<OptionsPageContentProps> = ({ sections, drawerWidth }) => {
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
        >
            <Toolbar />
            <Container maxWidth="sm">
                <Stack spacing={3}>
                    {sections.map((section) => (
                        <SectionRoot key={section.id} section={section} />
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};
