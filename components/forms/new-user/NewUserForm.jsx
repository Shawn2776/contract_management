"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Briefcase,
  Users,
  Building2,
  Building,
  UsersRound,
} from "lucide-react";

import {
  ShoppingBag,
  Utensils,
  HeartPulse,
  Wrench,
  Shirt,
  Music,
  Store,
  Ellipsis,
} from "lucide-react";

const businessTypes = [
  {
    id: "sole-proprietorship",
    name: "Sole Proprietorship",
    icon: Briefcase,
  },
  {
    id: "partnership",
    name: "Partnership",
    icon: Users,
  },
  {
    id: "llc",
    name: "Limited Liability Company",
    icon: Building2,
  },
  {
    id: "corporation",
    name: "Corporation",
    icon: Building,
  },
  {
    id: "unincorporated",
    name: "Unincorporated Business Association or Organization",
    icon: UsersRound,
  },
  {
    id: "individual",
    name: "Individual / Sole Trader",
    icon: Briefcase, // or swap for a “person” icon
  },
];

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const businessCategories = [
  { id: "retail-misc", name: "Retail - Miscellaneous", icon: ShoppingBag },
  {
    id: "food-hospitality",
    name: "Food, Drinks and Hospitality",
    icon: Utensils,
  },
  {
    id: "professional",
    name: "Professional Services and Organizations",
    icon: Briefcase,
  },
  {
    id: "health-beauty",
    name: "Health, Beauty and Wellness",
    icon: HeartPulse,
  },
  { id: "services", name: "Services", icon: Wrench },
  { id: "clothing", name: "Clothing and Apparel", icon: Shirt },
  { id: "leisure", name: "Leisure and Entertainment", icon: Music },
  { id: "retail", name: "Retail", icon: Store },
  { id: "other", name: "Other", icon: Ellipsis },
];

const NewUserForm = () => {
  return (
    <div className="flex flex-col md:mt-10 border-t-white border-t md:border-none">
      {/* <h1 className="hidden md:flex text-2xl max-w-sm mx-auto">NewUserPage</h1> */}
      <div className="max-w-md bg-white rounded-md shadow-lg">
        <div className="bg-primary">
          <div className="text-left w-full text-2xl font-bold text-white bg-primary px-4 pt-4 rounded-t-md">
            Business Information
          </div>
          <div className="text-gray-300 text-left w-full bg-primary px-4 border-b pb-8">
            Enter your business details below
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4">
          <Form>
            <div className="flex gap-2 flex-row">
              <Label
                htmlFor="business_name"
                className="flex flex-col items-center w-full"
              >
                <span className="text-left w-full">Business Name</span>
                <Input
                  id="business_name"
                  type="text"
                  placeholder="Business name"
                />
              </Label>
              <Label
                htmlFor="ein"
                className="flex flex-col items-center w-full"
              >
                <span className="text-left w-full">EIN</span>
                <Input id="ein" type="text" placeholder="123456789" />
              </Label>
            </div>
            <div className="flex gap-2 flex-row">
              <Label
                htmlFor="business_type"
                className="flex flex-col w-full max-w-1/2"
              >
                <span className="text-left w-full">Type</span>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="overflow-hidden">
                    <SelectGroup>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          <div className="flex items-center gap-4">
                            <type.icon className="w-6 h-6" />
                            <span className="text-left">{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
              <Label htmlFor="state" className="flex flex-col w-full">
                <span className="text-left w-full">State</span>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          <div className="flex items-center gap-4">{state}</div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
            </div>
            <hr />
            <div className="flex gap-2 flex-row">
              <Label
                htmlFor="business_category"
                className="flex flex-col w-full max-w-1/2"
              >
                <span className="text-left w-full">Business Category</span>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business category" />
                  </SelectTrigger>
                  <SelectContent className="overflow-hidden">
                    <SelectGroup>
                      {businessCategories.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          <div className="flex items-center gap-4">
                            <type.icon className="w-6 h-6" />
                            <span className="text-left">{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
              <div className="w-full max-w-1/2">2</div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewUserForm;
