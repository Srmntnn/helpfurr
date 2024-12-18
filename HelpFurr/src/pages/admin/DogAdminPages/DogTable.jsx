import React, { useEffect, useState, Fragment } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { SlOptionsVertical } from "react-icons/sl";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const DogCards = (props) => {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [user, setUser] = useState(null);

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const truncateText = (text, maxLength) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/users/`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const formatTimeAgo = (updatedAt) => {
    return formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/approving/${props.dog._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "Approved", userId: user._id }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setShowErrorPopup(true); // Show error popup modal
        setIsOpen(true); // Open the error modal
      } else {
        setShowApproved(true); // Show the approval success message
        setIsOpen(true); // Open the approval modal
      }
    } catch (err) {
      console.error("Error approving dog:", err);
      setShowErrorPopup(true); // Show error popup modal
      setIsOpen(true); // Open the error modal
    } finally {
      setIsApproving(false);
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponses = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/delete/many/${props.dog._id}`,
        { method: "DELETE" }
      );

      if (!deleteResponses.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch (err) {
      console.error(err);
      setShowErrorPopup(true); // Show error popup modal
      setIsOpen(true); // Open the error modal
    } finally {
      handleReject();
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/delete/${props.dog._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pet");
      } else {
        setshowDeletedSuccess(true); // Show deleted success popup
        setIsOpen(true); // Open the deleted success modal
      }
    } catch (err) {
      console.error("Error deleting pet:", err);
      setShowErrorPopup(true); // Show error popup modal
      setIsOpen(true); // Open the error modal
    } finally {
      setIsDeleting(false); // Reset the deleting state
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-500"; // Green
      case "Rejected":
        return "text-red-500"; // Red
      case "Pending":
        return "text-orange-500"; // Orange
      default:
        return "";
    }
  };

  return (
    <div className="req-container">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle quicksand-regular">
          <div class="border border-gray-200 shadow sm:rounded-lg mt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_80px] md:gap-0 gap-4 p-4">
              <div class="flex flex-col p-4 gap-2">
                <span class="font-semibold text-gray-800 text-sm">#</span>
                <span class="text-gray-600 h-full flex items-center">
                  {props.index + 1}
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2">
                <span class="font-semibold text-gray-800 text-sm">
                  Dog Info
                </span>
                <div className="h-full flex items-center gap-3">
                  <div className="avatar text-gray-600 h-full flex items-center">
                    <div className="mask mask-squircle h-12 w-12">
                      <img src={props.dog.image[0]} alt={props.dog.name} />
                    </div>
                  </div>
                  <div className="h-full flex  flex-col justify-center">
                    <div className="font-bold text-sm">{props.dog.name}</div>
                    <div className="text-sm opacity-50">{props.dog.age}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-4 gap-2 ">
                <span className="font-semibold text-gray-800 text-sm">
                  Dog Gender
                </span>
                <span className="text-gray-600 h-full flex items-center capitalize text-sm">
                  {props.dog.gender}
                </span>
              </div>
              <div className="flex flex-col p-4 gap-2 ">
                <span className="font-semibold text-gray-800 text-sm">
                  Dog Condition
                </span>
                <span className="text-gray-600 h-full flex items-center capitalize text-sm">
                  {truncateText(props.dog.condition, 40)}
                  {props.dog.condition?.length > 40 && (
                    <span
                      onClick={() => setShowConditionPopup(!showConditionPopup)}
                      className="read-more-btn text-blue-500 cursor-pointer"
                    >
                      Read More
                    </span>
                  )}
                </span>
              </div>
              <div className={`flex flex-col p-4 gap-2`}>
                <span className="font-semibold text-gray-800 text-sm">
                  Status
                </span>
                <span
                  className={`text-gray-600 h-full flex items-center capitalize text-sm ${getStatusClass(
                    props.dog.status
                  )}`}
                >
                  {props.dog.status}
                </span>
              </div>
              <div className="flex flex-col p-4 gap-2 ">
                <span className="font-semibold text-gray-800 text-sm">
                  Other Information
                </span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  <div className="flex flex-col capitalize">
                    <p>
                      <span className="font-bold">Vaccinated:</span>{" "}
                      {props.dog.vaccinated}
                    </p>
                    <p>
                      <span className="font-bold">Adoption Urgency:</span>{" "}
                      {props.dog.urgent}
                    </p>
                    <p>
                      <span className="font-bold">Neutered:</span>{" "}
                      {props.dog.neutered}
                    </p>
                  </div>
                </span>
              </div>
              <div className="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">
                  Owner Information
                </span>
                <span className="text-gray-600 h-full flex items-center capitalize text-sm">
                  <div className="align-middle [&:has([role=checkbox])]:pr-0">
                    <p>{props.dog.postedBy}</p>
                    <p className="lowercase">{props.dog.clientEmail}</p>
                    <p> {props.dog.phone}</p>
                  </div>
                </span>
              </div>
              <div className="flex flex-col p-4 gap-2 ">
                <span className="font-semibold text-gray-800 text-sm">
                  Action
                </span>
                <span className="text-gray-600 h-full flex items-center capitalize text-sm">
                  <Menu>
                    <MenuButton className="inline-flex items-center gap-2 focus:outline-none">
                      <SlOptionsVertical />
                    </MenuButton>

                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="w-52 origin-top-right rounded-md px-4 mt-2 py-6 gap-2 flex flex-col border bg-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                      <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 quicksand-regular">
                          <MdEdit />
                          Edit
                        </button>
                      </MenuItem>

                      {/* <MenuItem>
                        {props.approveBtn && (
                          <button
                            disabled={isDeleting || isApproving}
                            onClick={handleApprove}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 group flex w-full items-center gap-2 data-[focus]:bg-white/10"
                          >
                            <FaCheck />
                            {isApproving ? "Approving..." : "Approve"}
                          </button>
                        )}
                      </MenuItem> */}
                      <MenuItem>
                        <button
                          onClick={handleReject}
                          disabled={isDeleting || isApproving}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg items-center gap-1 flex w-full hover:bg-red-600 disabled:bg-gray-400 quicksand-regular"
                        >
                          <MdDelete />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center">
                <b>Last Updated:</b>{" "}
                <span className="ml-2">
                  {formatTimeAgo(props.dog.updatedAt)}
                </span>
              </div> */}
      {/* <div className="app-rej-btn flex space-x-4 mt-4">
        <button
          onClick={deleteFormsAdoptedPet}
          disabled={isDeleting || isApproving}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
        >
          {isDeleting ? "Deleting..." : props.deleteBtnText}
        </button>
        {props.approveBtn && (
          <button
            disabled={isDeleting || isApproving}
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        )}
      </div> */}
      {/* Popups */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    {showApproved
                      ? "Dog Approved"
                      : showDeletedSuccess
                      ? "Pet Deleted"
                      : showErrorPopup
                      ? "Oops!... Connection Error"
                      : "Processing"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 quicksand-regular">
                      {showApproved
                        ? "This dog has been approved!"
                        : showDeletedSuccess
                        ? "This dog has been successfully deleted."
                        : showErrorPopup
                        ? "There was an issue connecting to the server. Please try again later."
                        : "Please wait while we process your request..."}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
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
    </div>
  );
};

export default DogCards;
