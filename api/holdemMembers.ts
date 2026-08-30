import axios from "axios";

export type HoldemMember = {
  id?: string | number;
  name?: string;
  nickname: string;
};

type HoldemMemberResponse =
  | string[]
  | HoldemMember[]
  | {
      data?: string[] | HoldemMember[];
      items?: string[] | HoldemMember[];
      members?: string[] | HoldemMember[];
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

const normalizeHoldemMembers = (
  response: HoldemMemberResponse
): HoldemMember[] => {
  const members = Array.isArray(response)
    ? response
    : (response.members ?? response.items ?? response.data ?? []);

  return members
    .map((member) => {
      if (typeof member === "string") {
        return {
          nickname: member.trim(),
        };
      }

      const nickname = (member.nickname || member.name || "").trim();

      return {
        id: member.id,
        nickname,
      };
    })
    .filter((member) => member.nickname.length > 0);
};

export const getHoldemMembers = async () => {
  requireApiUrl();
  const response = await holdemMembersApi.get<HoldemMemberResponse>("/members");

  return normalizeHoldemMembers(response.data);
};
