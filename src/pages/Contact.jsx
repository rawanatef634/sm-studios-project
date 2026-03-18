import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    location: "",
    area: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Full Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.project) newErrors.project = "Project type is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setStatus("");

      // EmailJS configuration
      emailjs
        .send(
          "service_41tcyx3",     
          "template_12trddm",   
          {
            to_email: "info@smstudios-om.com", 
            from_name: form.name,
            from_email: form.email,
            phone: form.phone,
            project: form.project,
            location: form.location,
            area: form.area,
            requirements: form.requirements,
          },
          "86X4kGg_jxE-O56Ty"     // Your Public Key
        )
        .then(
          () => {
            setStatus("Message sent successfully ✅");
            setIsSubmitting(false);
            // Reset form after successful submission
            setForm({
              name: "",
              email: "",
              phone: "",
              project: "",
              location: "",
              area: "",
              requirements: "",
            });
          },
          (error) => {
            setStatus("Something went wrong ❌");
            setIsSubmitting(false);
            console.error("EmailJS Error:", error);
          }
        );
    }
  };

  return (
    <>
      <HeroSection
        title="GET IN TOUCH"
        breadcrumb="HOME / CONTACT"
        backgroundImage="/assets/contact.jpg"
      />

      <div className="bg-[#161B1E]">
        {/* Intro */}
        <motion.section
          className="text-white text-center py-10 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="max-w-6xl mx-auto md:text-[32px]">
            Let's discuss your next project. Our team is ready to bring your ideas to life.
          </p>
        </motion.section>

        {/* Form + Map */}
        <section className="text-white py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              className="w-full h-[500px] overflow-hidden shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <iframe
                title="map"
                src="https://www.google.com/maps?q=Muscat,Oman&hl=es;z=14&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              {[
                { name: "name", placeholder: "Full Name *" },
                { name: "email", placeholder: "Email *" },
                { name: "phone", placeholder: "Phone" },
                { name: "project", placeholder: "Project Type *" },
                { name: "location", placeholder: "Location" },
                { name: "area", placeholder: "Area (SQM)" },
              ].map((field, idx) => (
                <div key={idx}>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors"
                    disabled={isSubmitting}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Special Requirements"
                rows="4"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors resize-none"
                disabled={isSubmitting}
              ></textarea>

              {status && (
                <p className={`text-sm mt-2 text-center ${
                  status.includes("✅") ? "text-green-400" : "text-red-400"
                }`}>
                  {status}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer bg-white text-black px-8 py-3 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "SENDING..." : "SUBMIT"}
                </button>
              </div>
            </motion.form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;