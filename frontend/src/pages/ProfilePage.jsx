import Card from 'react-bootstrap/Card';
import {CardHeader, Col, Container, Row} from "react-bootstrap";


const Profile = () => {

    return (
        <>
            <h1>Profile Page</h1>
            <Row >
                <Col>
                    <Card>
                        <CardHeader>First Name</CardHeader>
                        <Card.Body>Cameron</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Last Name</CardHeader>
                        <Card.Body>Spencer</Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className={"py-2"}>
                <Col>
                    <Card>
                        <CardHeader>Email</CardHeader>
                        <Card.Body>cameronspencer@gmail.com</Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className={"py-2"}>
                <Col>
                    <Card>
                        <CardHeader>Branch</CardHeader>
                        <Card.Body>Army</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Component</CardHeader>
                        <Card.Body>Active</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Pay Grade</CardHeader>
                        <Card.Body>E5</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Years of Service</CardHeader>
                        <Card.Body>4</Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className={"py-2"}>
                <Col>
                    <Card>
                        <CardHeader>Age</CardHeader>
                        <Card.Body>26</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Target Retirement Age</CardHeader>
                        <Card.Body>44</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Marital Status</CardHeader>
                        <Card.Body>Single</Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>Dependents</CardHeader>
                        <Card.Body>0</Card.Body>
                    </Card>
                </Col>
            </Row>


        </>

    )
}

export default Profile;