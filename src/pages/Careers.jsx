import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Careers = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Full Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!file) newErrors.file = "Please upload your resume";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(selected.type) &&
      selected.size <= 10 * 1024 * 1024
    ) {
      setFile(selected);
      setStatus("");
      if (errors.file) {
        setErrors({ ...errors, file: "" });
      }
    } else {
      setFile(null);
      setStatus("Invalid file. Only .pdf, .doc, .docx under 10MB allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setStatus("");

      try {
        // Send notification email without attachment
        await emailjs.send(
          "service_41tcyx3",
          "template_12trddm",
          {
            to_email: "info@smstudios-om.com",
            from_name: form.name,
            from_email: form.email,
            phone: form.phone,
            position: form.position,
            message: form.message,
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(2) + " KB",
            instruction: `Please reply to ${form.email} to request their resume file: ${file.name}`
          },
          "86X4kGg_jxE-O56Ty"
        );

        setStatus(`Application received! ✅ We'll contact you at ${form.email} to request your resume.`);
        setIsSubmitting(false);
        
        // Reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          position: "",
          message: "",
        });
        setFile(null);
      } catch (error) {
        setStatus("Failed to submit. Please email your resume directly to info@smstudios-om.com ❌");
        setIsSubmitting(false);
        console.error("EmailJS Error:", error);
      }
    }
  };

  return (
    <>
      <HeroSection
        title="CAREERS"
        breadcrumb="HOME / CAREERS"
        backgroundImage="/assets/contact.jpg"
      />

      <div className="bg-[#161B1E]">
        {/* Intro */}
        <motion.section
          className="text-white text-center py-12 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="max-w-6xl mx-auto text-[32px]">
            We don't have any open positions right now, but we'd love to stay connected.  
            You can send us your CV and we'll reach out when opportunities arise.
          </p>
        </motion.section>

        {/* Form Section */}
        <motion.section
          className="py-16 px-6 flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl space-y-6"
          >
            {/* Personal Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full Name *"
                  className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-gray-400 transition-colors text-white placeholder-gray-500"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email *"
                  className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-gray-400 transition-colors text-white placeholder-gray-500"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  placeholder="Phone"
                  className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-gray-400 transition-colors text-white placeholder-gray-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  type="text"
                  placeholder="Desired Position"
                  className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-gray-400 transition-colors text-white placeholder-gray-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="3"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-gray-400 transition-colors text-white placeholder-gray-500 resize-none"
                disabled={isSubmitting}
              ></textarea>
            </div>

            {/* File Upload */}
            <div className="border border-gray-600 bg-transparent rounded-lg p-10 text-center mt-8">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-8m0 0l-3 3m3-3l3 3m-9 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-300 mb-2 md:text-[26px]">
                  Drag your resume here or click to upload
                </p>
                <p className="md:text-[16px] text-gray-300">Use a pdf, docx, or doc (Max 10MB)</p>
              </label>

              <input
                id="resume-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />

              {file && (
                <p className="mt-4 text-gray-300 text-sm">
                  Selected: <span className="font-semibold">{file.name}</span>
                </p>
              )}

              {errors.file && (
                <p className="mt-2 text-red-500 text-sm">{errors.file}</p>
              )}
            </div>

            {status && (
              <p className={`text-center text-sm mt-4 ${
                status.includes("✅") ? "text-green-400" : "text-red-400"
              }`}>
                {status}
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer text-xl bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-4">
              Or email your resume directly to: <a href="mailto:info@smstudios-om.com" className="text-white underline">info@smstudios-om.com</a>
            </p>
          </form>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Careers;