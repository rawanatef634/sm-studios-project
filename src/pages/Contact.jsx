import { useState } from "react";
import { motion } from "framer-motion";
import { captureError, event } from "@heronsignal/web";
import { Paperclip } from "lucide-react";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import { useSiteSettings } from "../context/SiteSettingsContext";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const ATTACHMENT_EXT = /\.(pdf|doc|docx|jpe?g|png)$/i;

const OFFICE_MAP_QUERY = "AQAR - Al Khonji Real Estate & Development SAOC";
const OFFICE_MAP_LINK = "https://maps.app.goo.gl/DEzSRcX1FBEotF7g8";

const uploadAttachment = async (file, onProgress) => {
  const { upload } = await import("@vercel/blob/client");
  const safeName =
    file.name.replace(/[^\w.-]+/g, "_").slice(-80) || "attachment";
  const blob = await upload(`contact-attachments/${safeName}`, file, {
    access: "private",
    handleUploadUrl: "/api/contact-upload",
    contentType: file.type || undefined,
    onUploadProgress: ({ percentage }) => onProgress(Math.round(percentage)),
  });
  return { pathname: blob.pathname, filename: file.name };
};

const Contact = () => {
  const { t } = useSiteSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    location: "",
    area: "",
    requirements: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Full Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
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

  const handleAttachmentChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      setAttachment(null);
      return;
    }
    if (
      ATTACHMENT_EXT.test(selected.name) &&
      selected.size <= MAX_ATTACHMENT_BYTES
    ) {
      setAttachment(selected);
      setErrors({ ...errors, attachment: "" });
    } else {
      setAttachment(null);
      e.target.value = "";
      setErrors({
        ...errors,
        attachment: "Only .pdf, .doc, .docx, .jpg, .png under 15MB allowed.",
      });
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    const input = document.getElementById("contact-attachment");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setStatus("");

      try {
        const payload = { ...form };
        if (attachment) {
          setUploadProgress(0);
          try {
            payload.attachment = await uploadAttachment(
              attachment,
              setUploadProgress,
            );
          } catch (uploadError) {
            setErrors({
              attachment:
                "The file could not be uploaded. Please try again or email it to info@smstudios-om.com.",
            });
            throw uploadError;
          } finally {
            setUploadProgress(null);
          }
        }

        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          if (data.errors) setErrors(data.errors);

          throw new Error(
            data.error || `Contact request failed with status ${res.status}`,
          );
        }

        event("contact_form_submitted", {
          projectType: form.project,
          location: form.location || "unspecified",
        });

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
        clearAttachment();
      } catch (error) {
        console.error("Contact form submission failed:", error);
        captureError(error);

        setStatus("Something went wrong ❌");
      } finally {
        setIsSubmitting(false);
      }
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
          <p className="w-full whitespace-pre-line px-6 md:px-8 md:text-[32px] font-['El_Messiri'] font-light">
            {t("contact.intro")}
          </p>
        </motion.section>

        {/* Form + Map */}
        <section className="text-white py-16 px-6">
          <div className="w-full px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              className="w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="w-full h-[500px] overflow-hidden shadow-lg">
                <iframe
                  title="SM Studios office location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(OFFICE_MAP_QUERY)}&z=17&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mt-4 text-gray-300">
                <p>Second Floor, Office 207</p>
                <a
                  href={OFFICE_MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline hover:text-white transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
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
                { name: "phone", placeholder: "Phone *", type: "tel" },
                { name: "project", placeholder: "Project Type *" },
                { name: "location", placeholder: "Location" },
                { name: "area", placeholder: "Area (SQM)" },
              ].map((field, idx) => (
                <div key={idx}>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    type={field.type || "text"}
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
                placeholder="Any Notice"
                rows="4"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors resize-none"
                disabled={isSubmitting}
              ></textarea>

              <div>
                <label
                  htmlFor="contact-attachment"
                  className="flex items-center gap-3 border border-dashed border-gray-600 px-4 py-3 cursor-pointer hover:border-white transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-400 truncate">
                    {attachment
                      ? attachment.name
                      : "Attach a file (pdf, doc, docx, jpg, png — max 15MB)"}
                  </span>
                </label>
                <input
                  id="contact-attachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAttachmentChange}
                  disabled={isSubmitting}
                />
                {attachment && (
                  <button
                    type="button"
                    onClick={clearAttachment}
                    disabled={isSubmitting}
                    className="mt-1 text-sm text-gray-400 underline hover:text-white cursor-pointer"
                  >
                    Remove attachment
                  </button>
                )}
                {errors.attachment && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.attachment}
                  </p>
                )}
              </div>

              {status && (
                <p
                  className={`text-sm mt-2 text-center ${
                    status.includes("✅") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {status}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer bg-white text-black px-8 py-3 font-['El_Messiri'] tracking-[0.12em] hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadProgress !== null
                    ? `UPLOADING ${uploadProgress}%`
                    : isSubmitting
                      ? "SENDING..."
                      : "SUBMIT"}
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
