import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const LandingPage = () => {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#3a4132",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Container>
                <Row className="justify-content-center text-center">
                    <Col md={8} lg={6}>

                        {/* Logo */}
                        <div style={{ marginBottom: "48px" }}>
                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "64px",
                                letterSpacing: "6px",
                                color: "#c8a84b",
                                lineHeight: 1,
                                marginBottom: "4px",
                            }}>
                                <span style={{ color: "#ffffff" }}>LETHAL</span> FINANCE
                            </h1>
                            <p style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "11px",
                                letterSpacing: "3px",
                                color: "#6b7560",
                                textTransform: "uppercase",
                                margin: 0,
                            }}>
                                Military Retirement Planning System
                            </p>
                        </div>

                        {/* Tagline */}
                        <p style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: "16px",
                            color: "#ede9de",
                            marginBottom: "48px",
                            lineHeight: 1.6,
                        }}>
                            Plan your military retirement with precision.<br />
                            BRS calculator, financial goals, and budget tools — all in one place.
                        </p>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                            <Button
                                as={Link}
                                to="/login"
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    letterSpacing: "2px",
                                    fontSize: "15px",
                                    background: "#c8a84b",
                                    border: "none",
                                    color: "#1a1c18",
                                    padding: "10px 32px",
                                    borderRadius: "3px",
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                as={Link}
                                to="/register"
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    letterSpacing: "2px",
                                    fontSize: "15px",
                                    background: "transparent",
                                    border: "1px solid #c8a84b",
                                    color: "#c8a84b",
                                    padding: "10px 32px",
                                    borderRadius: "3px",
                                }}
                            >
                                Register
                            </Button>
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LandingPage;