import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ProfileForm from "../lethalfinance/profile/ProfileForm.jsx";
import { findProfileByUserId, updateProfile } from "../services/ProfileService.js";

const EditProfilePage = () => {

    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // TODO: replace hardcoded userId with value from session/context once auth is wired up
    const userId = 1;

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await findProfileByUserId(userId);
                if (data) {
                    // Format dates to yyyy-MM-dd for date inputs
                    setProfile({
                        ...data,
                        dateOfBirth:      data.dateOfBirth?.substring(0, 10) ?? "",
                        serviceEntryDate: data.serviceEntryDate?.substring(0, 10) ?? "",
                    });
                }
            } catch (err) {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [userId]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await updateProfile(userId, data);
            setSuccessMessage("Profile updated successfully.");
            // Scroll to top so user sees the success message
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
                <Spinner animation="border" style={{ color: "#4a5240" }} />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>

                        {/* Header */}
                        <div style={{ marginBottom: "20px" }}>
                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "22px",
                                letterSpacing: "2px",
                                color: "#3a4132",
                                marginBottom: "2px",
                            }}>
                                Edit Profile
                            </h1>
                            <p style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "9px",
                                letterSpacing: "1px",
                                color: "#6b6a60",
                                textTransform: "uppercase",
                                margin: 0,
                            }}>
                                Update your personal and service information
                            </p>
                        </div>

                        {successMessage && (
                            <Alert
                                variant="success"
                                dismissible
                                onClose={() => setSuccessMessage(null)}
                                style={{ fontSize: "13px" }}
                            >
                                {successMessage}
                            </Alert>
                        )}

                        {/* Form card */}
                        <div style={{
                            background: "#ffffff",
                            border: "1px solid rgba(74,82,64,0.22)",
                            borderRadius: "4px",
                            padding: "24px",
                        }}>
                            <ProfileForm
                                onSubmit={onSubmit}
                                defaultValues={profile ?? {}}
                                submitLabel="Save Changes"
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

export default EditProfilePage;