import React, { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Label } from "./label";
import { Input } from "./input";
import { useAuthStore } from "../store/authStore";
import uploadImage from "../assets/upload (1).svg";
import { styles } from "@/styles";

function PopupModal({ isOpen, onClose, title, message }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 quicksand-bold"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 quicksand-regular">
                    {message}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-400 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function AdoptForm(props) {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [contactReference, setContactReference] = useState("");
  const [adopterName, setAdopterName] = useState(user?.name || "");
  const [occupation, setOccupation] = useState("");
  const [renting, setRenting] = useState("");
  const [familyAllergic, setFamilyAllergic] = useState("");
  const [address, setAddress] = useState("");
  const [neutering, setNeutering] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const openModal = (title, message) => {
    setModalInfo({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);

    if (props.dog.email === user.email) {
      openModal("Error", "You cannot adopt the dog you've posted.");
      return;
    }

    if (
      !email ||
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition ||
      !adopterName ||
      !contactReference ||
      !occupation ||
      !renting ||
      !familyAllergic ||
      !neutering ||
      !address
    ) {
      setFormError(true);
      openModal("Error", "Please fill out all fields.");
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      openModal("Error", "Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("phoneNo", phoneNo);
    formData.append("livingSituation", livingSituation);
    formData.append("previousExperience", previousExperience);
    formData.append("familyComposition", familyComposition);
    formData.append("email", email);
    formData.append("adopterName", adopterName);
    formData.append("contactReference", contactReference);
    formData.append("occupation", occupation);
    formData.append("renting", renting);
    formData.append("familyAllergic", familyAllergic);
    formData.append("neutering", neutering);
    formData.append("address", address);
    formData.append("dogId", props.dog._id);

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/save`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        openModal(
          "Error",
          "There was an issue connecting to the server. Please try again later."
        );
        return;
      } else {
        openModal(
          "Success",
          `Adoption form for ${props.dog.name} has been submitted. We'll get in touch with you soon.`
        );
      }
    } catch (err) {
      openModal(
        "Error",
        "There was an issue connecting to the server. Please try again later."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }

    setEmailError(false);
    setFormError(false);
    setEmail("");
    setPhoneNo("");
    setLivingSituation("");
    setPreviousExperience("");
    setFamilyComposition("");
    setContactReference("");
    setAdopterName("");
    setOccupation("");
    setRenting("");
    setFamilyAllergic("");
    setNeutering("");
    setAddress("");
  };

  return (
    <section className="w-full max-w-screen-lg">
      <div>
        <div className="">
          <div className="w-full md:w-[900px]">
            {props.dog && (
              <div className="flex sm:gap-4 gap-2  sm:flex-row flex-col pt-8">
                <div className="max-w-80">
                  <img
                    src={props.dog.image[0]}
                    alt={props.dog.name}
                    className=" w-full rounded-md"
                  />
                </div>
                <div className="flex flex-col mt-4 capitalize quicksand-regular basis-1/2">
                  <h2 className="text-2xl fredoka-bold text-secondary-orange mb-2">
                    {props.dog.name}
                  </h2>
                  <p>
                    <b>Age:</b> {props.dog.age}
                  </p>
                  <p>
                    <b>Gender:</b> {props.dog.gender}
                  </p>
                  <p>
                    <b>Location:</b> {props.dog.shelter}
                  </p>
                  <p>
                    <b>Current Owner:</b> {props.dog.postedBy}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className=" w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h1 className="mt-6 text-xl quicksand-regular font-bold text-main-brown">
                  Adopter Information
                </h1>
                <div className="flex gap-4">
                  <div className="flex basis-1/2 flex-col">
                    <Label className="">Email</Label>
                    {emailError && <p>Please provide valid email address.</p>}
                    <Input
                      type="email"
                      value={email}
                      placeholder="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex basis-1/2 flex-col">
                    <Label className="relative w-full">Adoptor Name</Label>
                    <Input
                      type="text"
                      value={adopterName}
                      onChange={(e) => setAdopterName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex basis-1/2 flex-col">
                    <Label className="relative w-full">Phone #</Label>
                    <Input
                      type="text"
                      value={phoneNo}
                      placeholder="Phone #"
                      onChange={(e) => setPhoneNo(e.target.value)}
                    />
                  </div>
                  <div className="flex basis-1/2 flex-col">
                    <Label className="relative w-full">Contact Reference</Label>
                    <Input
                      type="text"
                      value={contactReference}
                      placeholder="Enter contact reference"
                      onChange={(e) => setContactReference(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex basis-1/2 flex-col">
                  <Label className="relative w-full">Address</Label>
                  <Input
                    type="text"
                    value={address}
                    placeholder="Enter complete address"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="mt-6 text-xl quicksand-regular font-bold text-main-brown">
                  Details
                </h1>
                <div className="flex justify-center flex-col">
                  <Label className="relative w-full "> Living Situation</Label>
                  <Input
                    type="text"
                    placeholder="Living Situation"
                    value={livingSituation}
                    onChange={(e) => setLivingSituation(e.target.value)}
                  />
                </div>
                <div className="flex justify-center flex-col">
                  <Label className="relative w-full "> Occupation</Label>
                  <Input
                    type="text"
                    placeholder="Enter occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
                <div className="flex justify-center flex-col border px-3 py-5 rounded-md">
                  <Label className="relative w-full pb-2">
                    Are you renting an apartment if yes, are you allowed to keep
                    your pets?
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="rentingYes"
                        name="rentingType"
                        value="Yes"
                        checked={renting === "Yes"}
                        onChange={(e) => setRenting(e.target.value)}
                      />
                      <Label htmlFor="rentingYes" className="mb-0">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="rentingNo"
                        name="rentingType"
                        value="No"
                        checked={renting === "No"}
                        onChange={(e) => setRenting(e.target.value)}
                      />
                      <Label htmlFor="rentingNo" className="mb-0">
                        No
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center flex-col border px-3 py-5 rounded-md">
                  <Label className="relative w-full pb-2">
                    Are you in favor of neutering/spaying your petto avoid
                    unwanted litters/pups?
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="neuteringYes"
                        name="neuteringType"
                        value="Yes"
                        checked={neutering === "Yes"}
                        onChange={(e) => setNeutering(e.target.value)}
                      />
                      <Label htmlFor="neuteringYes" className="mb-0">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="neuteringNo"
                        name="neuteringType"
                        value="No"
                        checked={neutering === "No"}
                        onChange={(e) => setNeutering(e.target.value)}
                      />
                      <Label htmlFor="neuteringNo" className="mb-0">
                        No
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center flex-col border px-3 py-5 rounded-md">
                  <Label className="relative w-full pb-2">
                    Any of your family members who are allergic to dog?
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="familyAllergicYes"
                        name="familyAllergicType"
                        value="Yes"
                        checked={familyAllergic === "Yes"}
                        onChange={(e) => setFamilyAllergic(e.target.value)}
                      />
                      <Label htmlFor="familyAllergicYes" className="mb-0">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="familyAllergicNo"
                        name="familyAllergicType"
                        value="No"
                        checked={familyAllergic === "No"}
                        onChange={(e) => setFamilyAllergic(e.target.value)}
                      />
                      <Label htmlFor="familyAllergicNo" className="mb-0">
                        No
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center flex-col">
                <Label className="relative w-full">
                  Previous Dog Experience
                </Label>
                <Input
                  type="text"
                  placeholder="Previous Dog Experience"
                  value={previousExperience}
                  onChange={(e) => setPreviousExperience(e.target.value)}
                />
              </div>
              <div className="flex justify-center flex-col">
                <Label className="relative w-full">Other Pets </Label>
                <Input
                  type="text"
                  placeholder="Any Other Pets"
                  value={familyComposition}
                  onChange={(e) => setFamilyComposition(e.target.value)}
                />
              </div>

              <div className="">
                <Label>Upload a copy of your valid ID</Label>
                <p className="quicksand-regular mb-4">
                  Please upload a Government-issued ID or any Personal ID with
                  your picture and name. Make sure the name you indicated in
                  this application form matches the name on your ID. Please do
                  not upload personal photos.
                </p>
                <div className="flex gap-4 w-full border p-7 rounded-md">
                  <div className="flex flex-col w-full aspect-video overflow-hidden items-center justify-center border ">
                    <Label>Front</Label>
                    <label
                      htmlFor="image1"
                      className="text-main-brown cursor-pointer"
                    >
                      <img
                        src={
                          !image1 ? uploadImage : URL.createObjectURL(image1)
                        }
                        className="w-full object-cover  "
                        alt=""
                      />
                      <input
                        onChange={(e) => setImage1(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        hidden
                        id="image1"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-full overflow-hidden aspect-video  items-center justify-center border">
                    <Label>Back</Label>
                    <label
                      htmlFor="image2"
                      className="text-main-brown cursor-pointer"
                    >
                      <img
                        src={
                          !image2 ? uploadImage : URL.createObjectURL(image2)
                        }
                        className="w-full object-cover"
                        alt=""
                      />
                      <input
                        onChange={(e) => setImage2(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        hidden
                        id="image2"
                      />
                    </label>
                  </div>
                </div>
              </div>
              {formError && (
                <p className="error-message">Please fill out all fields.</p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-regular"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting" : "Submit"}
              </motion.button>
            </form>
            <PopupModal
              isOpen={modalInfo.isOpen}
              onClose={closeModal}
              title={modalInfo.title}
              message={modalInfo.message}
            />
          </div>
        </div>
      </div>
      {/* Popups */}
    </section>
  );
}

export default AdoptForm;
