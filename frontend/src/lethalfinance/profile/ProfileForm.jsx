import { object, string, number, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";

// ── Pay grade options ──────────────────────────────────────────
const PAY_GRADES = {
    enlisted: [
        { value: "E-1",  label: "E-1 — Private (PVT)" },
        { value: "E-2",  label: "E-2 — Private Second Class (PV2)" },
        { value: "E-3",  label: "E-3 — Private First Class (PFC)" },
        { value: "E-4",  label: "E-4 — Specialist / Corporal (SPC/CPL)" },
        { value: "E-5",  label: "E-5 — Sergeant (SGT)" },
        { value: "E-6",  label: "E-6 — Staff Sergeant (SSG)" },
        { value: "E-7",  label: "E-7 — Sergeant First Class (SFC)" },
        { value: "E-8",  label: "E-8 — Master Sergeant / First Sergeant (MSG/1SG)" },
        { value: "E-9",  label: "E-9 — Sergeant Major / CSM / SMA" },
    ],
    warrantofficer: [
        { value: "W-1",  label: "W-1 — Warrant Officer 1 (WO1)" },
        { value: "W-2",  label: "W-2 — Chief Warrant Officer 2 (CW2)" },
        { value: "W-3",  label: "W-3 — Chief Warrant Officer 3 (CW3)" },
        { value: "W-4",  label: "W-4 — Chief Warrant Officer 4 (CW4)" },
        { value: "W-5",  label: "W-5 — Chief Warrant Officer 5 (CW5)" },
    ],
    officer: [
        { value: "O-1",  label: "O-1 — Second Lieutenant (2LT)" },
        { value: "O-2",  label: "O-2 — First Lieutenant (1LT)" },
        { value: "O-3",  label: "O-3 — Captain (CPT)" },
        { value: "O-4",  label: "O-4 — Major (MAJ)" },
        { value: "O-5",  label: "O-5 — Lieutenant Colonel (LTC)" },
        { value: "O-6",  label: "O-6 — Colonel (COL)" },
        { value: "O-7",  label: "O-7 — Brigadier General (BG)" },
        { value: "O-8",  label: "O-8 — Major General (MG)" },
        { value: "O-9",  label: "O-9 — Lieutenant General (LTG)" },
        { value: "O-10", label: "O-10 — General (GEN)" },
    ],
};

const BRANCH_OPTIONS = [
    { value: "Army",         label: "Army" },
    { value: "Navy",         label: "Navy" },
    { value: "Marine Corps", label: "Marine Corps" },
    { value: "Air Force",    label: "Air Force" },
    { value: "Space Force",  label: "Space Force" },
    { value: "Coast Guard",  label: "Coast Guard" },
];

const COMPONENT_OPTIONS = [
    { value: "Active Duty",      label: "Active Duty" },
    { value: "Reserve",          label: "Reserve" },
    { value: "National Guard",   label: "National Guard" },
];

const MARITAL_STATUS_OPTIONS = [
    { value: "single",           label: "Single" },
    { value: "married",          label: "Married" },
    { value: "divorced",         label: "Divorced" },
    { value: "widowed",          label: "Widowed" },
    { value: "separated",        label: "Separated" },
    { value: "domestic_partner", label: "Domestic Partner" },
];

const DEPENDENT_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i === 0 ? "0 — No dependents" : i === 1 ? "1 dependent" : `${i} dependents`,
}));

// ── Validation schema ─────────────────────────────────────────
const profileSchema = object({
    firstName:            string().required("First name is required"),
    lastName:             string().required("Last name is required"),
    dateOfBirth:          string().required("Date of birth is required"),
    serviceEntryDate:     string().required("Service entry date is required"),
    branchOrAgency:       string().required("Branch is required"),
    component:            string().required("Component is required"),
    grade:                string().required("Pay grade is required"),
    targetRetirementYear: number()
        .typeError("Must be a valid year")
        .min(new Date().getFullYear(), "Must be in the future")
        .required("Target retirement year is required"),
    maritalStatus:        string().required("Marital status is required"),
    countOfDependents:    number().typeError("Required").required("Required"),
    location:             string()
        .matches(/^\d{5}$/, "Must be a 5-digit zip code")
        .required("Location is required"),
});

// ── Component ─────────────────────────────────────────────────

/**
 * ProfileForm
 *
 * Props:
 *   onSubmit      {function}  — called with form data on valid submit
 *   defaultValues {object}    — pre-fills form for edit mode
 *   submitLabel   {string}    — button label (default: "Save Profile")
 *   isSubmitting  {boolean}   — disables button while saving
 *   error         {string}    — top-level error message to display
 */
const ProfileForm = ({
                         onSubmit,
                         defaultValues = {},
                         submitLabel = "Save Profile",
                         isSubmitting = false,
                         error = null,
                     }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues,
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <Alert variant="danger" style={{ fontSize: "13px" }}>
                    {error}
                </Alert>
            )}

            <Row className="g-3">

                {/* First Name */}
                <Col md={6}>
                    <Form.Group controlId="firstName">
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

                {/* Last Name */}
                <Col md={6}>
                    <Form.Group controlId="lastName">
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

                {/* Date of Birth */}
                <Col md={6}>
                    <Form.Group controlId="dateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                            type="date"
                            {...register("dateOfBirth")}
                            isInvalid={!!errors.dateOfBirth}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateOfBirth?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Service Entry Date */}
                <Col md={6}>
                    <Form.Group controlId="serviceEntryDate">
                        <Form.Label>Service Entry Date</Form.Label>
                        <Form.Control
                            type="date"
                            {...register("serviceEntryDate")}
                            isInvalid={!!errors.serviceEntryDate}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.serviceEntryDate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Branch */}
                <Col md={6}>
                    <Form.Group controlId="branchOrAgency">
                        <Form.Label>Branch / Agency</Form.Label>
                        <Form.Select
                            aria-label="Branch or Agency"
                            {...register("branchOrAgency")}
                            isInvalid={!!errors.branchOrAgency}
                        >
                            <option value="">— Select branch —</option>
                            {BRANCH_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.branchOrAgency?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Component */}
                <Col md={6}>
                    <Form.Group controlId="component">
                        <Form.Label>Component</Form.Label>
                        <Form.Select
                            aria-label="Component"
                            {...register("component")}
                            isInvalid={!!errors.component}
                        >
                            <option value="">— Select component —</option>
                            {COMPONENT_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.component?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Pay Grade */}
                <Col md={6}>
                    <Form.Group controlId="grade">
                        <Form.Label>Pay Grade</Form.Label>
                        <Form.Select
                            aria-label="Pay Grade"
                            {...register("grade")}
                            isInvalid={!!errors.grade}
                        >
                            <option value="">— Select pay grade —</option>
                            {Object.entries(PAY_GRADES).map(([group, grades]) => (
                                <optgroup
                                    key={group}
                                    label={group.charAt(0).toUpperCase() + group.slice(1).replace("officer", " Officer")}
                                >
                                    {grades.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.grade?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Target Retirement Year */}
                <Col md={6}>
                    <Form.Group controlId="targetRetirementYear">
                        <Form.Label>Target Retirement Year</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder={new Date().getFullYear() + 20}
                            {...register("targetRetirementYear")}
                            isInvalid={!!errors.targetRetirementYear}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.targetRetirementYear?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Marital Status */}
                <Col md={6}>
                    <Form.Group controlId="maritalStatus">
                        <Form.Label>Marital Status</Form.Label>
                        <Form.Select
                            aria-label="Marital Status"
                            {...register("maritalStatus")}
                            isInvalid={!!errors.maritalStatus}
                        >
                            <option value="">— Select marital status —</option>
                            {MARITAL_STATUS_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.maritalStatus?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Count of Dependents */}
                <Col md={6}>
                    <Form.Group controlId="countOfDependents">
                        <Form.Label>Number of Dependents</Form.Label>
                        <Form.Select
                            aria-label="Number of Dependents"
                            {...register("countOfDependents")}
                            isInvalid={!!errors.countOfDependents}
                        >
                            <option value="">— Select number of dependents —</option>
                            {DEPENDENT_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.countOfDependents?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Location */}
                <Col md={6}>
                    <Form.Group controlId="location">
                        <Form.Label>Location (Zip Code)</Form.Label>
                        <Form.Control
                            type="text"
                            maxLength={5}
                            placeholder="e.g. 78201"
                            {...register("location")}
                            isInvalid={!!errors.location}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.location?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Buttons */}
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
                        {isSubmitting ? "Saving..." : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => reset()}
                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}
                    >
                        Reset
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileForm;