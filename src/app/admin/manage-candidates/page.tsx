"use client";
import { User } from "@/types/User";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageCandidatesPage = () => {
  const [candidates, setCandidates] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const fetchCandidates = async () => {
    const response = await axios.get("/api/candidates");
    setCandidates(response.data.candidates);
  };
  const handleApprove = async (id: string, status: boolean) => {
    try {
      const response = axios.put(
        `/api/candidates/approve?id=${id}&status=${status}`
      );
      toast.promise(response, {
        loading: "Approving candidate...",
        success: (data) => {
          fetchCandidates();
          return data.data.message;
        },
        error: (error) => {
          console.error("Error approving candidate:", error);
          return "Error approving candidate";
        },
      });
    } catch (error) {
      console.error("Error approving candidate:", error);
      toast.error("Error approving candidate");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = axios.delete(`/api/candidates/delete?id=${id}`);
      toast.promise(response, {
        loading: "Deleting candidate...",
        success: (data) => {
          fetchCandidates();
          return data.data.message;
        },
        error: (error) => {
          console.error("Error deleting candidate:", error);
          return "Error deleting candidate";
        },
      });
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Error deleting candidate");
    }
  };
  useEffect(() => {
    fetchCandidates();
  }, []);
  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Manage Candidates
      </h1>
      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-base-300 rounded-box">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Date Of Birth</th>
              <th>Gender</th>
              <th>Aadhar Card</th>
              <th>Currently Allowed</th>
              <th>Total Exam Given</th>
              <th>Actions</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, index) => (
                <tr key={candidate._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={candidate.profileImage}
                            alt={candidate.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{candidate.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{candidate.email}</td>
                  <td>{candidate.contact}</td>
                  <td>{new Date(candidate.dob).toLocaleDateString("en-GB")}</td>
                  <td className="capitalize">{candidate.gender}</td>
                  <td>
                    <span>{candidate.aadharCard.number}</span>
                    <br />
                    <a
                      href={candidate.aadharCard.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                    >
                      View Aadhar Card
                    </a>
                  </td>
                  <td>
                    {candidate.currentlyAllowed ? "Allowed" : "Not Allowed"}
                  </td>
                  <td>{candidate.examAttempts.length}</td>
                  <td className="space-x-2">
                    <div className="flex items-center gap-2">
                      <button
                        className={`flex  btn btn-sm ${
                          candidate.currentlyAllowed
                            ? "btn-error"
                            : "btn-success"
                        }`}
                        onClick={() =>
                          handleApprove(
                            candidate._id!,
                            !candidate.currentlyAllowed
                          )
                        }
                      >
                        {candidate.currentlyAllowed ? (
                          <IconX size={18} />
                        ) : (
                          <IconCheck size={18} />
                        )}
                        {candidate.currentlyAllowed ? "Disallow" : "Allow"}
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(candidate._id!)}
                      >
                        <IconTrash size={18} /> Delete
                      </button>
                    </div>
                  </td>
                  <td>
                    <Link
                      href={`/admin/candidates?id=${candidate._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center">
                  No candidate Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageCandidatesPage;
