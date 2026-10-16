import "server-only";

import React from "react";
import { Body, Column, Container, Head, Heading, Html, Img, Preview, Row, Section, Text } from "react-email";

import type { NotificationEmailContent } from "@/features/notifications/utils/notification.email.type";
import { ImageConstants } from "@/lib/image.constants";

/** Presents transactional messages in the application's shared email layout. */
export default function NotificationEmail({ brand, title, introduction, highlight, guidance, signoff, footer, footerTagline, footerDescription }: NotificationEmailContent) {
    return (
        <Html lang="en">
            <Head />
            <Preview>{title}</Preview>
            <Body className="emailBody" style={{ margin: 0, padding: "32px 12px", fontFamily: "Arial, Helvetica, sans-serif" }}>
                <Container className="emailContainer" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Section className="emailHeader" style={{ padding: "32px 28px 40px" }}>
                        <Text className="brand" style={{ margin: "0 0 40px", fontSize: "12px", fontWeight: 700, lineHeight: "20px", letterSpacing: "3px", textTransform: "uppercase" }}>{brand}</Text>
                        <Heading as="h1" className="emailTitle" style={{ margin: 0, fontSize: "48px", fontWeight: 600, lineHeight: "52px", letterSpacing: "-2px" }}>{title}</Heading>
                    </Section>
                    <Section className="emailContent" style={{ padding: "36px 28px 40px" }}>
                        <Text className="bodyText" style={{ margin: "0 0 24px", fontSize: "16px", lineHeight: "26px" }}>{introduction}</Text>
                        {highlight && (
                            <Section className="highlight" style={{ borderRadius: "12px" }}>
                                <Text className="highlightText" style={{ margin: 0, padding: "22px 24px", fontSize: "28px", fontWeight: 600, lineHeight: "36px", letterSpacing: "normal" }}>{highlight}</Text>
                            </Section>
                        )}
                        <Text className="bodyText" style={{ margin: "24px 0 36px", fontSize: "16px", lineHeight: "26px", whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{guidance}</Text>
                        <Text className="bodyText" style={{ margin: 0, fontSize: "14px", lineHeight: "22px", whiteSpace: "pre-line" }}>{signoff}</Text>
                    </Section>
                    <Section className="emailFooter" style={{ padding: "32px 28px" }}>
                        <Row style={{ marginBottom: "16px" }}>
                            <Column style={{ width: "42px" }}>
                                <Img src={ImageConstants.FindmusIcon} alt="" width={30} height={33} />
                            </Column>
                            <Column>
                                <Text className="footerBrand" style={{ margin: 0, fontSize: "24px", fontWeight: 600, lineHeight: "32px" }}>{brand}</Text>
                            </Column>
                        </Row>
                        {footerTagline && <Text className="footerText" style={{ margin: "0 0 20px", fontSize: "14px", lineHeight: "24px" }}>{footerTagline}</Text>}
                        {footerDescription && <Text className="footerText" style={{ margin: "0 0 28px", fontSize: "14px", lineHeight: "24px" }}>{footerDescription}</Text>}
                        <Section className="footerDivider" style={{ paddingTop: "20px" }}>
                            <Text className="footerText" style={{ margin: 0, fontSize: "12px", lineHeight: "20px" }}>{footer}</Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
