import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import i4 from "../assets/logoi2.png";

const skills = ["Software development", "Machine learning", "UX/UI design", "Natural language processing", "Game development"];

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    state: "",
    country: "",
    expertise: [],
    interests: "",
  });

  const [expertise1, setExpertise1] = useState("");
  const [expertise2, setExpertise2] = useState("");
  const [expertise3, setExpertise3] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const expertise = [expertise1, expertise2, expertise3].filter((skill) => skill);
      const finalFormData = { ...formData, expertise };
      const response = await api.post("/register", finalFormData);
      if (response.data.success)
        navigate("/");
      else {
        setError(response.data.message);
        alert(response.data.message);
        navigate("/");
      }
    } catch (err) {
      const errorMessage = "Registration failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div>
    <img src={i4} className="logoimg2" />
    <p className="loginhead2">Already have an account?</p>
    <button className="gotoaccountbtn" onClick={() => navigate("/")}>Log in</button>
    <div className="wholesignuppage">
    <div className="register-container">
      <h2 className="signuphead2">Create your account</h2>
      <p className="justfillpara">Just fill these inputs, and your account will be created!</p>
      <form onSubmit={handleRegister}>
        <div>
          <input className="inpsignup"
            type="text" placeholder="Name"
            name="name" value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input className="inpsignup"
            type="email" placeholder="Email"
            name="email" value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input className="inpsignup"
            type="password" placeholder="Password"
            name="password" value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <h2 className="addresslabel">Where do you live?</h2>
        <div className="registeraddressdiv">
          <div><input className="inpsignup inpsignupaddress" type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required /></div>
          <div><input className="inpsignup inpsignupaddress" type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} required /></div>
          <div><input className="inpsignup inpsignupaddress" type="text" placeholder="Country" name="country" value={formData.country} onChange={handleChange} required /></div>
        </div>
        <h2 className="expregisterheading">What are you expert at?</h2>
        <div className="expertregisterdiv">
          <select
                className="selectexp"
                value={expertise1}
                onChange={(e) => setExpertise1(e.target.value)}
                required
              >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <select
                className="selectexp"
                value={expertise2}
                onChange={(e) => setExpertise2(e.target.value)}
              >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <select
                className="selectexp"
                value={expertise3}
                onChange={(e) => setExpertise3(e.target.value)}
              >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
        </div>
        <div className="interestregisterdiv">
              <label>What do you want to learn?</label>
              <select className="selectinterest" name="interests" value={formData.interests} onChange={handleChange} required >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <button className="signupbtninsignuppage" type="submit">Sign up</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Register;
