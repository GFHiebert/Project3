import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import API from "../../Utils/API";
import "./style.css";

function Signups(props) {

    const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });


    // Load all books and store them with setBooks

    // Loads all books and sets them to books

    // Deletes a book from the database with a given id, then reloads books from the db
    // function deleteBook(id) {
    //     API.deleteBook(id)
    //         .then(res => loadUser())
    //         .catch(err => console.log(err));
    // }

    // Handles updating component state when the user types into the input field
    function handleInputChange(event) {
        const { name, value } = event.target;
        setNewUser({ ...newUser, [name]: value })
    };

    // likely to be in the signup than login
    function handleFormSubmit(event) {
        event.preventDefault();
        // console.log(newUser)
        // if (formObject.title && formObject.author) {
        API.saveUser(
            newUser //not making a new object so {} is not necessary

        )
            .then(res => {
                // console.log("user data in signup")
                // console.log(res.data)
                localStorage.setItem("id", res.data._id)
                localStorage.setItem("firstName", res.data.firstName);
                localStorage.setItem("lastName", res.data.lastName);
                if (res.data) {
                    window.location= "/main"
                } else {
                    alert("Invalid Login")
                }
            })
            .catch(err => console.log(err));
        // }
    };


    return (
        
        <Form onSubmit={handleFormSubmit} id="signup-form" class="container-fluid">
            <form-row>
                <form-col>
                    <Form.Control className="form-name" placeholder="First name" onChange={handleInputChange} name="firstName" />
                </form-col>
                <form-col>
                    <Form.Control className="form-name" placeholder="Last name" onChange={handleInputChange} name="lastName" />
                </form-col>
            </form-row>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address </Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleInputChange} name="email" />
                <Form.Text className="text-muted">
                    You will use your email to login.
                    </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handleInputChange} name="password" />
                <Form.Label>Re-Enter Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handleInputChange} name="confirmPassword" />
            </Form.Group>
            <Button id="submit-button" type="submit">Submit</Button>

        </Form>
        
    );
}
export default Signups;