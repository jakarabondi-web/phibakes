import type { Testimonial } from "@/types";
import { AVATAR_IMAGES } from "./images";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Wanjiru Kamau",
    role: "Bride, Karen",
    avatar: AVATAR_IMAGES[0],
    rating: 5,
    quote:
      "PhiBakes designed and delivered our wedding cake exactly as we imagined — three tiers of pure elegance. Our guests are still talking about it.",
  },
  {
    id: "t2",
    name: "Brian Otieno",
    role: "Marketing Lead, Tatu Foods",
    avatar: AVATAR_IMAGES[1],
    rating: 5,
    quote:
      "We ordered a branded sheet cake for our product launch and the whole process — from quote to M-PESA payment — was seamless.",
  },
  {
    id: "t3",
    name: "Amina Hassan",
    role: "Mother of two, Westlands",
    avatar: AVATAR_IMAGES[2],
    rating: 5,
    quote:
      "I love that I can track my order in real time. Watching it move from 'Baking' to 'Out for Delivery' took away all the birthday-day stress.",
  },
  {
    id: "t4",
    name: "David Mwangi",
    role: "Graduate, University of Nairobi",
    avatar: AVATAR_IMAGES[3],
    rating: 5,
    quote:
      "Ordered a graduation cake two days before the ceremony and it arrived perfectly on time, beautifully decorated with my faculty colours.",
  },
  {
    id: "t5",
    name: "Faith Njeri",
    role: "Event Planner, Faith Events Co.",
    avatar: AVATAR_IMAGES[4],
    rating: 5,
    quote:
      "PhiBakes is now our go-to bakery partner for every event we plan. Reliable, gorgeous cakes, and a dashboard that keeps everyone updated.",
  },
  {
    id: "t6",
    name: "Kevin Wafula",
    role: "Repeat Customer",
    avatar: AVATAR_IMAGES[5],
    rating: 4,
    quote:
      "The custom cake builder made it so easy to describe exactly what I wanted. Got an instant quote and paid the deposit with M-PESA in minutes.",
  },
];
