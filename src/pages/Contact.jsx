import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { event, log, captureError } from "@heronsignal/web";
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
  const inquiryStartedRef = useRef(false);
  const projectTypeSelectedRef = useRef(false);

  const markInquiryStarted = () => {
    if (inquiryStartedRef.current) return;
    inquiryStartedRef.current = true;
    event("inquiry_started", { source: "contact_form" });
  };

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
    markInquiryStarted();
    if (
      e.target.name === "project" &&
      e.target.value.trim() &&
      !projectTypeSelectedRef.current
    ) {
      projectTypeSelectedRef.current = true;
      event("inquiry_project_type_selected", { source: "contact_form" });
    }
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    markInquiryStarted();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setStatus("");
      event("inquiry_submitted", { source: "contact_form" });

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          log("warn", "Inquiry send failed", { step: "submit" });
          if (data.errors) setErrors(data.errors);
          setStatus(data.error || "Something went wrong ❌");
          return;
        }

        event("inquiry_completed", { source: "contact_form" });
        setStatus("Message sent successfully ✅");
        setForm({
          name: "",
          email: "",
          phone: "",
          project: "",
          location: "",
          area: "",
          requirements: "",
        });
      } catch (error) {
        log("warn", "Inquiry send failed", { step: "submit" });
        captureError(error instanceof Error ? error : String(error));
        setStatus("Something went wrong ❌");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      log("warn", "Inquiry validation failed", { step: "validate" });
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
          <p className="max-w-6xl mx-auto md:text-[32px] font-['El_Messiri'] font-light">
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
                  className="cursor-pointer bg-white text-black px-8 py-3 font-['El_Messiri'] tracking-[0.12em] hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
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