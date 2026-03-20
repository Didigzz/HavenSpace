"use client";

import * as React from "react";
import {
  Check,
  X,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  User,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  Skeleton,
} from "@havenspace/shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  cn,
  formatDate,
  formatDateTime,
  getInitials,
  getRelativeTime,
} from "@/lib/utils";

// Mock data for applications
const mockApplications = [
  {
    id: "1",
    status: "pending",
    applicant: {
      name: "Maria Santos",
      email: "maria.santos@example.com",
      phone: "+63 917 123 4567",
      avatar: null,
    },
    businessInfo: {
      businessName: "Santos Property Management",
      businessType: "Individual",
      yearsExperience: 5,
      numberOfProperties: 3,
    },
    documents: [
      { name: "Valid ID", status: "verified" },
      { name: "Business Permit", status: "pending" },
      { name: "Proof of Property Ownership", status: "verified" },
    ],
    properties: [
      {
        name: "Sunny View Boarding House",
        address: "123 Main St, Manila",
        rooms: 10,
      },
      {
        name: "Green Residence",
        address: "456 Oak Ave, Quezon City",
        rooms: 8,
      },
      { name: "Blue Sky Dormitory", address: "789 Pine Rd, Makati", rooms: 15 },
    ],
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    notes: "",
  },
  {
    id: "2",
    status: "pending",
    applicant: {
      name: "Juan Cruz",
      email: "juan.cruz@example.com",
      phone: "+63 918 234 5678",
      avatar: null,
    },
    businessInfo: {
      businessName: "Cruz Rentals",
      businessType: "Corporation",
      yearsExperience: 10,
      numberOfProperties: 1,
    },
    documents: [
      { name: "Valid ID", status: "verified" },
      { name: "SEC Registration", status: "verified" },
      { name: "Proof of Property Ownership", status: "verified" },
    ],
    properties: [
      { name: "Cruz Dormitory", address: "321 Elm St, Pasig", rooms: 20 },
    ],
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    notes: "",
  },
  {
    id: "3",
    status: "approved",
    applicant: {
      name: "Ana Reyes",
      email: "ana.reyes@example.com",
      phone: "+63 919 345 6789",
      avatar: null,
    },
    businessInfo: {
      businessName: "Reyes Homes",
      businessType: "Individual",
      yearsExperience: 3,
      numberOfProperties: 2,
    },
    documents: [
      { name: "Valid ID", status: "verified" },
      { name: "Business Permit", status: "verified" },
      { name: "Proof of Property Ownership", status: "verified" },
    ],
    properties: [
      { name: "Reyes Residences", address: "654 Maple Dr, Taguig", rooms: 12 },
      {
        name: "Cozy Corner BH",
        address: "987 Cedar Ln, Mandaluyong",
        rooms: 6,
      },
    ],
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    reviewedBy: "Admin User",
    notes: "All documents verified. Approved for landlord access.",
  },
  {
    id: "4",
    status: "rejected",
    applicant: {
      name: "Pedro Garcia",
      email: "pedro.garcia@example.com",
      phone: "+63 920 456 7890",
      avatar: null,
    },
    businessInfo: {
      businessName: "Garcia Properties",
      businessType: "Individual",
      yearsExperience: 1,
      numberOfProperties: 1,
    },
    documents: [
      { name: "Valid ID", status: "rejected" },
      { name: "Business Permit", status: "pending" },
      { name: "Proof of Property Ownership", status: "rejected" },
    ],
    properties: [
      { name: "Garcia Boarding", address: "111 Unknown St, Manila", rooms: 5 },
    ],
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    reviewedBy: "Admin User",
    notes:
      "Invalid documents submitted. ID appears to be expired and property ownership documents do not match.",
  },
];

type ApplicationStatus = "pending" | "approved" | "rejected";
type Application = (typeof mockApplications)[0];

const statusColors: Record<ApplicationStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const documentStatusColors: Record<string, string> = {
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function ApplicationsPage() {
  const [filter, setFilter] = React.useState<"all" | ApplicationStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedApplication, setSelectedApplication] =
    React.useState<Application | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [reviewAction, setReviewAction] = React.useState<
    "approve" | "reject" | null
  >(null);
  const [reviewNotes, setReviewNotes] = React.useState("");

  const filteredApplications = mockApplications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessInfo.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = mockApplications.filter(
    (app) => app.status === "pending"
  ).length;
  const approvedCount = mockApplications.filter(
    (app) => app.status === "approved"
  ).length;
  const rejectedCount = mockApplications.filter(
    (app) => app.status === "rejected"
  ).length;

  const handleReview = (action: "approve" | "reject") => {
    setReviewAction(action);
    setIsReviewDialogOpen(true);
  };

  const confirmReview = () => {
    // In a real app, this would call an API
    console.log(
      `${reviewAction} application ${selectedApplication?.id} with notes: ${reviewNotes}`
    );
    setIsReviewDialogOpen(false);
    setSelectedApplication(null);
    setReviewAction(null);
    setReviewNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Landlord Applications
          </h1>
          <p className="text-muted-foreground">
            Review and manage landlord registration applications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-muted-foreground text-xs">
              Applications awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-muted-foreground text-xs">
              Approved landlords this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-muted-foreground text-xs">
              Rejected applications this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">
              All ({mockApplications.length})
            </TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search applications..."
            className="w-full pl-9 md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="text-muted-foreground/50 h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                No applications found
              </h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "No applications match the selected filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Applicant Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={application.applicant.avatar || undefined}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(application.applicant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {application.applicant.name}
                          </h3>
                          <Badge
                            className={cn(
                              "text-xs",
                              statusColors[
                                application.status as ApplicationStatus
                              ]
                            )}
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {application.businessInfo.businessName}
                        </p>
                        <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {application.applicant.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {application.applicant.phone}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {application.properties.length}{" "}
                            {application.properties.length === 1
                              ? "property"
                              : "properties"}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Submitted {getRelativeTime(application.submittedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t p-4 md:border-t-0 md:border-l md:p-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {application.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedApplication(application);
                            handleReview("approve");
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            handleReview("reject");
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Details Dialog */}
      <Dialog
        open={!!selectedApplication && !isReviewDialogOpen}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Review the complete application information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Applicant Info */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <User className="h-4 w-4" />
                    Applicant Information
                  </h4>
                  <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground text-sm">Full Name</p>
                      <p className="font-medium">
                        {selectedApplication.applicant.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Email</p>
                      <p className="font-medium">
                        {selectedApplication.applicant.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Phone</p>
                      <p className="font-medium">
                        {selectedApplication.applicant.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Status</p>
                      <Badge
                        className={cn(
                          statusColors[
                            selectedApplication.status as ApplicationStatus
                          ]
                        )}
                      >
                        {selectedApplication.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Building2 className="h-4 w-4" />
                    Business Information
                  </h4>
                  <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Business Name
                      </p>
                      <p className="font-medium">
                        {selectedApplication.businessInfo.businessName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Business Type
                      </p>
                      <p className="font-medium">
                        {selectedApplication.businessInfo.businessType}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Years of Experience
                      </p>
                      <p className="font-medium">
                        {selectedApplication.businessInfo.yearsExperience} years
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Number of Properties
                      </p>
                      <p className="font-medium">
                        {selectedApplication.businessInfo.numberOfProperties}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    Submitted Documents
                  </h4>
                  <div className="space-y-2">
                    {selectedApplication.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span>{doc.name}</span>
                        <Badge
                          className={cn(
                            "text-xs",
                            documentStatusColors[doc.status]
                          )}
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Properties */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Building2 className="h-4 w-4" />
                    Properties to Register
                  </h4>
                  <div className="space-y-2">
                    {selectedApplication.properties.map((property, idx) => (
                      <div key={idx} className="rounded-lg border p-3">
                        <p className="font-medium">{property.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {property.address}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {property.rooms} rooms
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Notes (if reviewed) */}
                {selectedApplication.notes && (
                  <div>
                    <h4 className="mb-3 font-semibold">Review Notes</h4>
                    <div className="bg-muted/50 rounded-lg border p-4">
                      <p className="text-sm">{selectedApplication.notes}</p>
                      {selectedApplication.reviewedAt && (
                        <p className="text-muted-foreground mt-2 text-xs">
                          Reviewed by {selectedApplication.reviewedBy} on{" "}
                          {formatDateTime(selectedApplication.reviewedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                {selectedApplication.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedApplication(null)}
                    >
                      Close
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleReview("approve")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReview("reject")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
                {selectedApplication.status !== "pending" && (
                  <Button onClick={() => setSelectedApplication(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Confirmation Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve"
                ? "Approve Application"
                : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? "This will grant the applicant landlord access to the platform."
                : "This will reject the application. The applicant will be notified."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Review Notes</label>
              <textarea
                className="bg-background mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
                rows={4}
                placeholder={
                  reviewAction === "approve"
                    ? "Add any notes about the approval (optional)..."
                    : "Provide a reason for rejection (required)..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReview}
              className={cn(
                reviewAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive hover:bg-destructive/90"
              )}
              disabled={reviewAction === "reject" && !reviewNotes.trim()}
            >
              {reviewAction === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
