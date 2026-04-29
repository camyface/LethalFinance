import {number, string, object} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {profile} from "./ProfileType.js";
import {saveProfile} from "../../services/ProfileService.js";
import {useNavigate} from "react-router-dom";


const ProfileForm = () => {

    const profileSchema = object( {
        branchOrAgency: string(),
        component: string(),
        grade: string(),
        yearsOfService: number(),
        currentAge: number(),
        targetRetirementAge: number(),
        annualIncome: number(),
        monthlyTspContributions: number(),
        monthlyOtherContributions: number(),
        maritalStatus: string(),
        countOfDependents: number(),
        location: string()
            .length(5, "Enter valid zipcode")


    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm( {
        resolver: yupResolver(profileSchema),
        defaultValues: {

        }
    });

    // Pay grades object — add or remove entries here as needed
    const PAY_GRADES = {
        enlisted: [
            { value: 'E-1',  label: 'E-1 — Private (PVT)' },
            { value: 'E-2',  label: 'E-2 — Private Second Class (PV2)' },
            { value: 'E-3',  label: 'E-3 — Private First Class (PFC)' },
            { value: 'E-4',  label: 'E-4 — Specialist / Corporal (SPC/CPL)' },
            { value: 'E-5',  label: 'E-5 — Sergeant (SGT)' },
            { value: 'E-6',  label: 'E-6 — Staff Sergeant (SSG)' },
            { value: 'E-7',  label: 'E-7 — Sergeant First Class (SFC)' },
            { value: 'E-8',  label: 'E-8 — Master Sergeant / First Sergeant (MSG/1SG)' },
            { value: 'E-9',  label: 'E-9 — Sergeant Major / CSM / SMA' },
        ],
        warrantofficer: [
            { value: 'W-1',  label: 'W-1 — Warrant Officer 1 (WO1)' },
            { value: 'W-2',  label: 'W-2 — Chief Warrant Officer 2 (CW2)' },
            { value: 'W-3',  label: 'W-3 — Chief Warrant Officer 3 (CW3)' },
            { value: 'W-4',  label: 'W-4 — Chief Warrant Officer 4 (CW4)' },
            { value: 'W-5',  label: 'W-5 — Chief Warrant Officer 5 (CW5)' },
        ],
        officer: [
            { value: 'O-1',  label: 'O-1 — Second Lieutenant (2LT)' },
            { value: 'O-2',  label: 'O-2 — First Lieutenant (1LT)' },
            { value: 'O-3',  label: 'O-3 — Captain (CPT)' },
            { value: 'O-4',  label: 'O-4 — Major (MAJ)' },
            { value: 'O-5',  label: 'O-5 — Lieutenant Colonel (LTC)' },
            { value: 'O-6',  label: 'O-6 — Colonel (COL)' },
            { value: 'O-7',  label: 'O-7 — Brigadier General (BG)' },
            { value: 'O-8',  label: 'O-8 — Major General (MG)' },
            { value: 'O-9',  label: 'O-9 — Lieutenant General (LTG)' },
            { value: 'O-10', label: 'O-10 — General (GEN)' },
        ],
    };

    const MARITAL_STATUS_OPTIONS = [
        { value: 'single',         label: 'Single' },
        { value: 'married',        label: 'Married' },
        { value: 'divorced',       label: 'Divorced' },
        { value: 'widowed',        label: 'Widowed' },
        { value: 'separated',      label: 'Separated' },
        { value: 'domestic_partner', label: 'Domestic Partner' },
    ];

    const DEPENDENT_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i === 0 ? '0' : i === 1 ? '1' : `${i}`,
    }));

    const onSubmit = async (profile) => {
        await saveProfile(profile);
        // useNavigate()
    }

    return (
        <>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <div className="reservation-card p-4 rounded-4 shadow-sm">
                            <h1 className="mb-4 text-center">Edit Profile</h1>

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group controlId="payGrade">
                                            <Form.Label>Pay Grade</Form.Label>
                                            <Form.Select
                                                aria-label="Pay Grade"
                                                {...register("payGrade")}
                                                isInvalid={!!errors.payGrade}
                                            >
                                                <option value="">— Select pay grade —</option>
                                                {Object.entries(PAY_GRADES).map(([group, grades]) => (
                                                    <optgroup
                                                        key={group}
                                                        label={group.charAt(0).toUpperCase() + group.slice(1).replace('officer', ' Officer')}
                                                    >
                                                        {grades.map(({ value, label }) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.payGrade?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="target_retirement_age">
                                            <Form.Label>Target Retirement Age</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register("targetRetirementAge")}
                                                isInvalid={!!errors.targetRetirementAge}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.targetRetirementAge?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="annual_income">
                                            <Form.Label>Annual Income</Form.Label>
                                            <Form.Control
                                                type="number"
                                                {...register("annualIncome")}
                                                isInvalid={!!errors.annualIncome}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.annualIncome?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="location">
                                            <Form.Label>Location (Zipcode)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register("location")}
                                                isInvalid={!!errors.location}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.location?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="count_of_dependents">
                                            <Form.Label>Number of Dependents</Form.Label>
                                            <Form.Select
                                                aria-label="Number of Dependents"
                                                {...register("countOfDependents")}
                                                isInvalid={!!errors.countOfDependents}
                                            >
                                                <option value="">— Select number of dependents —</option>
                                                {DEPENDENT_OPTIONS.map(({ value, label }) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.countOfDependents?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="marital_status">
                                            <Form.Label>Marital Status</Form.Label>
                                            <Form.Select
                                                aria-label="Marital Status"
                                                {...register("maritalStatus")}
                                                isInvalid={!!errors.maritalStatus}
                                            >
                                                <option value="">— Select marital status —</option>
                                                {MARITAL_STATUS_OPTIONS.map(({ value, label }) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.maritalStatus?.message}
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

export default ProfileForm;