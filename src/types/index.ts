export interface Subsection {
  id: string;
  name: string;
  file: string;
}

export interface Section {
  id: string;
  name: string;
  file?: string; // Optional now, for sections without subsections
  subsections?: Subsection[]; // Optional subsections array
}

export interface Chapter {
  id: string;
  name: string;
  sections: Section[];
}

export interface Axis {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface LearningStructure {
  axes: Axis[];
}

export interface NavigationItem {
  axisId: string;
  chapterId: string;
  sectionId: string;
  subsectionId?: string; // Optional for subsections
  axisName: string;
  chapterName: string;
  sectionName: string;
  subsectionName?: string; // Optional subsection name
  file: string;
}
