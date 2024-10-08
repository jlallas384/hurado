import {
  TaskAttachmentDTO,
  TaskCreditDTO,
  TaskDTO,
  TaskSubtaskDTO,
  TaskDataDTO,
} from "common/validation/task_validation";
import {
  TaskCreditED,
  TaskED,
  TaskSubtaskED,
  TaskDataED,
} from "./types";
import { CheckerKind } from "common/types/constants";
import { CommonAttachmentED, EditorKind } from "../common_editor";

export function coerceTaskED(dto: TaskDTO): TaskED {
  const task: TaskED = {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    description: dto.description,
    statement: dto.statement,
    checker:
      dto.checker_kind !== CheckerKind.Custom
        ? { kind: dto.checker_kind }
        : { kind: dto.checker_kind, script: dto.checker_file_name as any },
    credits: dto.credits.map(coerceTaskCreditED),
    attachments: dto.attachments.map((x) => coerceTaskAttachmentED(x)),
    type: dto.type,
    flavor: 'flavor' in dto ? dto.flavor : null,
    subtasks: dto.subtasks.map((x) => coerceTaskSubtaskED(x)),
  };
  return task;
}

function coerceTaskCreditED(dto: TaskCreditDTO): TaskCreditED {
  return {
    kind: EditorKind.Saved,
    id: dto.id as string,
    name: dto.name,
    role: dto.role,
    deleted: false,
  };
}

function coerceTaskAttachmentED(dto: TaskAttachmentDTO): CommonAttachmentED {
  return {
    kind: EditorKind.Saved,
    id: dto.id as string,
    path: dto.path,
    file: {
      kind: EditorKind.Saved,
      hash: dto.file_hash,
    },
    mime_type: dto.mime_type,
    deleted: false,
  };
}

function coerceTaskSubtaskED(dto: TaskSubtaskDTO): TaskSubtaskED {
  return {
    kind: EditorKind.Saved,
    id: dto.id as string,
    name: dto.name,
    score_max: dto.score_max,
    data: dto.data.map(coerceTaskDataED),
    deleted: false,
  };
}

function coerceTaskDataED(dto: TaskDataDTO): TaskDataED {
  return {
    kind: EditorKind.Saved,
    id: dto.id as string,
    name: dto.name,
    is_sample: "is_sample" in dto ? dto.is_sample : false,
    input_file:
      "input_file_hash" in dto
        ? {
            kind: EditorKind.Saved,
            hash: dto.input_file_hash,
          }
        : null,
    input_file_name: "input_file_name" in dto ? dto.input_file_name : null,
    judge_file: {
      kind: EditorKind.Saved,
      hash: dto.judge_file_hash,
    },
    judge_file_name: dto.judge_file_name,
    deleted: false,
  };
}
