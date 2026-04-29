import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/UserService.js";

const RegisterPage = () => {

    const navigate = useNavigate();

    const userSchema = object({
        email: string()
            .email("Please enter a valid email")
            .required("Email is required"),
        password: string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: string()
            .required("Please confirm your password")
            .test("passwords-match", "Passwords do not match", function (value) {
                return this.parent.password === value;
            }),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(userSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            await registerUser({
                email: data.email,
                password: data.password,
            });
            navigate("/login");
        } catch (err) {
            setError("root", { message: err.message || "Registration failed. Please try again." });
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#3a4132",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={6}>

                        {/* Logo */}
                        <div className="text-center mb-4">
                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "36px",
                                letterSpacing: "4px",
                                color: "#c8a84b",
                                lineHeight: 1,
                            }}>
                                <span style={{ color: "#ffffff" }}>LETHAL</span> FINANCE
                            </h1>
                        </div>

                        {/* Card */}
                        <div style={{
                            background: "#f5f2ea",
                            border: "1px solid rgba(74,82,64,0.22)",
                            borderRadius: "4px",
                            padding: "28px",
                        }}>
                            <h2 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "22px",
                                letterSpacing: "2px",
                                color: "#3a4132",
                                marginBottom: "20px",
                                textAlign: "center",
                            }}>
                                Create Account
                            </h2>

                            {errors.root && (
                                <Alert variant="danger" style={{ fontSize: "13px" }}>
                                    {errors.root.message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                {...register("email")}
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                {...register("password")}
                                                isInvalid={!!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="confirmPassword">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                {...register("confirmPassword")}
                                                isInvalid={!!errors.confirmPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12} className="d-flex gap-2 justify-content-center mt-3">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            style={{
                                                fontFamily: "'Bebas Neue', sans-serif",
                                                letterSpacing: "2px",
                                                fontSize: "14px",
                                                background: "#3a4132",
                                                border: "none",
                                                color: "#c8a84b",
                                                padding: "8px 28px",
                                                borderRadius: "3px",
                                            }}
                                        >
                                            {isSubmitting ? "Creating Account..." : "Register"}
                                        </Button>
                                    </Col>

                                    <Col md={12} className="text-center mt-2">
                                        <span style={{ fontSize: "13px", color: "#6b6a60" }}>
                                            Already have an account?{" "}
                                            <Link to="/login" style={{ color: "#9a7e30" }}>
                                                Login
                                            </Link>
                                        </span>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RegisterPage;