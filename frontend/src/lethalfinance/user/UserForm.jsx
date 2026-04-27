import {object, string} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {saveUser} from "../../services/UserService.js";

const UserForm = () => {

    const userSchema = object( {
        firstName: string()
            .required("Required"),

        lastName: string()
            .required("Required"),

        email: string()
            .required("Required"),

        password: string()
            .required("Required"),

        role: string()
            .default("USER"),

        createdAt: string(),

        updatedAt: string()
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(userSchema),
        defaultValues: {

        }
    });

    const onSubmit = async (user) => {
        await saveUser(user);
        reset();

    }

    return(
        <>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <div className="reservation-card p-4 rounded-4 shadow-sm">
                            <h1 className="mb-4 text-center">Register</h1>

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group controlId="full_name">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register("firstName")}
                                                isInvalid={!!errors.firstName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="full_name">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register("lastName")}
                                                isInvalid={!!errors.lastName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

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

                                    <Col md={12} className="d-flex gap-2 justify-content-center mt-3">
                                        <Button type="submit" className="menu-button">
                                            Submit
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-secondary"
                                            onClick={() => reset()}
                                        >
                                            Reset
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

        </>

    )
}

export default UserForm;