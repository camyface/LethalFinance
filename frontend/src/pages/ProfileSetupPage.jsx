import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ProfileForm from "../lethalfinance/profile/ProfileForm.jsx";
import { saveProfile } from "../services/ProfileService.js";

const ProfileSetupPage = () => {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const userId = sessionStorage.getItem('userId');
            await saveProfile({ ...data, userId: parseInt(userId) });
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Failed to save profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f5f2ea",
            paddingTop: "40px",
            paddingBottom: "40px",
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>

                        {/* Header */}
                        <div style={{ marginBottom: "24px" }}>
                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "26px",
                                letterSpacing: "2px",
                                color: "#3a4132",
                                marginBottom: "4px",
                            }}>
                                Complete Your Profile
                            </h1>
                            <p style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "10px",
                                letterSpacing: "1px",
                                color: "#6b6a60",
                                textTransform: "uppercase",
                                margin: 0,
                            }}>
                                This information is used to personalize your retirement calculations
                            </p>
                        </div>

                        {/* Form card */}
                        <div style={{
                            background: "#ffffff",
                            border: "1px solid rgba(74,82,64,0.22)",
                            borderRadius: "4px",
                            padding: "24px",
                        }}>
                            <ProfileForm
                                onSubmit={onSubmit}
                                submitLabel="Complete Setup"
                                isSubmitting={isSubmitting}
                                error={error}
                            />
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfileSetupPage;