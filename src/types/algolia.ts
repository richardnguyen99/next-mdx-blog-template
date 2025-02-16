import {
  AutocompleteContext,
  AutocompleteInsightsApi,
  AutocompleteState,
  BaseItem,
} from "@algolia/autocomplete-core";
import { type Frontmatter } from "./mdx";

type Heading = {
  depth: number;
  text: string;
};

export interface InternalSearchAlgoliaAttributes {
  title: Frontmatter["title"];
  description: Frontmatter["description"];
  publishedAt: Frontmatter["publishedAt"];
  tags: Frontmatter["tags"];
  imageUrl: string;
  headings: Heading[];
}

interface InternalSearchHitAttributeHighlightResult {
  value: string;
  matchLevel: "full" | "none" | "partial";
  matchedWords: string[];
  fullyHighlighted?: boolean;
}

interface InternalSearchHitHighlightResult {
  description: InternalSearchHitAttributeHighlightResult;
  headings: Array<InternalSearchHitAttributeHighlightResult>;
  tags: Array<InternalSearchHitAttributeHighlightResult>;
  title: InternalSearchHitAttributeHighlightResult;
}

interface InternalSearchHitAttributeSnippetResult {
  value: string;
  matchLevel: "full" | "none" | "partial";
}

interface InternalSearchHitSnippetResult {
  description: InternalSearchHitAttributeSnippetResult;
  headings: Array<InternalSearchHitAttributeSnippetResult>;
}

export declare type InternalSearchHit = InternalSearchAlgoliaAttributes & {
  objectID: string;
  _highlightResult: InternalSearchHitHighlightResult;
  _snippetResult: InternalSearchHitSnippetResult;
  _rankingInfo?: {
    promoted: boolean;
    nbTypos: number;
    firstMatchedWord: number;
    proximityDistance?: number;
    geoDistance: number;
    geoPrecision?: number;
    nbExactWords: number;
    words: number;
    filters: number;
    userScore: number;
    matchedGeoLocation?: {
      lat: number;
      lng: number;
      distance: number;
    };
  };
  _distinctSeqID?: number;
  __autocomplete_indexName?: string;
  __autocomplete_queryID?: string;
  __autocomplete_algoliaCredentials?: {
    appId: string;
    apiKey: string;
  };
  __autocomplete_id?: number;
};

export type InternalStoredSearchHit = Omit<
  InternalSearchHit,
  "_highlightResult" | "_snippetResult"
>;

export type InternalSearchHitWithParent = InternalSearchHit & {
  __parent: InternalSearchHitWithParent | null;
  [key: string]: unknown;
};

interface InternalSearchContext extends AutocompleteContext {
  algoliaInsightsPlugin?: {
    insights: AutocompleteInsightsApi;
  };
}

export interface InternalSearchState<TItem extends BaseItem>
  extends AutocompleteState<TItem> {
  context: InternalSearchContext;
}
