import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Spinner,
	Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { loginPending, loginSuccess, loginFail } from "../login/loginSlice";
import { verifyOTP } from "../../api/userApi";
import { getUserProfile } from "../../pages/dashboard/userAction";

export const VerifyForm = ({ formSwitcher }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	let location = useLocation();

	const { isLoading, isAuth, error } = useSelector(state => state.login);
	let { from } = location.state || { from: { pathname: "/" } };

	/* useEffect(() => {
		sessionStorage.getItem("accessJWT") && history.replace(from);
	}, [history, isAuth]); */

	const [eotp, setEotp] = useState("");
	const [potp, setPotp] = useState("");

	const handleOnChange = e => {
		const { name, value } = e.target;

		switch (name) {
			case "eotp":
				setEotp(value);
				break;

			case "potp":
				setPotp(value);
				break;

			default:
				break;
		}
	};

	const handleOnSubmit = async e => {
		e.preventDefault();
        let id = sessionStorage.getItem("id");
		if (!eotp || !potp) {
			return alert("Fill up all the form!");
		}

		dispatch(loginPending());
		try {
			const isAuth = await verifyOTP({ id, eotp, potp });

			if (isAuth.status === "error") {
				console.log(isAuth);
				return dispatch(loginFail(isAuth.message));
			}
			else{
				//dispatch(loginSuccess());
				//dispatch(getUserProfile());
				history.push("/");
			}
			
		} catch (error) {
			console.log('in error ',error);
			dispatch(loginFail(error.message));
		}
	};

	return (
		<Container>
			<Row>
				<Col>
					<h1 className="text-info text-center">User Verification</h1>
					<hr />
					{error && <Alert variant="danger">{error}</Alert>}
					<Form autoComplete="off" onSubmit={handleOnSubmit}>
						<Form.Group>
							<Form.Label>Email OTP</Form.Label>
							<Form.Control
								type="text"
								name="eotp"
								value={eotp}
								onChange={handleOnChange}
								placeholder="Enter OTP"
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Phone OTP</Form.Label>
							<Form.Control
								type="text"
								name="potp"
								onChange={handleOnChange}
								value={potp}
								placeholder="Enter OTP"
								required
							/>
						</Form.Group>

						<Button type="submit">Verify</Button>
						{isLoading && <Spinner variant="primary" animation="border" />}
					</Form>
					<hr />
				</Col>
			</Row>
			<Row className="py-4">
				<Col>
					Are you new here? <a href="/registration">Register Now</a>
				</Col>
			</Row>
		</Container>
	);
};

export default VerifyForm;