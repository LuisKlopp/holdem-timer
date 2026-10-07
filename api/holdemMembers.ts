import axios from "axios";

export type HoldemMemberGender = "FEMALE" | "MALE";

export type HoldemMember = {
  gender: HoldemMemberGender | null;
  id: number;
  nickname: string;
};

type HoldemMemberResponse = {
  members: HoldemMember[];
};

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");

const holdemMembersApi = axios.create({
  baseURL: apiUrl,
});

const requireApiUrl = () => {
  if (!apiUrl) {
    throw new Error(
      "홀덤 API 주소가 설정되지 않았습니다. NEXT_PUBLIC_BASE_URL을 확인해 주세요."
    );
  }
};

export const getHoldemMembers = async () => {
  requireApiUrl();
  const response = await holdemMembersApi.get<HoldemMemberResponse>("/members");

  return response.data.members;
};
