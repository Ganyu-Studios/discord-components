import * as ReactComponents from '@penwin/discord-components-core';
import { createReactComponent } from './react-components/createComponent.js';

/* IMPORTS START */

export const DiscordActionRow = createReactComponent('discord-action-row', ReactComponents.DiscordActionRow);
export const DiscordAttachments = createReactComponent('discord-attachments', ReactComponents.DiscordAttachments);
export const DiscordAudioAttachment = createReactComponent('discord-audio-attachment', ReactComponents.DiscordAudioAttachment);
export const DiscordAuthorInfo = createReactComponent('discord-author-info', ReactComponents.DiscordAuthorInfo);
export const DiscordBold = createReactComponent('discord-bold', ReactComponents.DiscordBold);
export const DiscordButton = createReactComponent('discord-button', ReactComponents.DiscordButton);
export const DiscordCode = createReactComponent('discord-code', ReactComponents.DiscordCode);
export const DiscordCommand = createReactComponent('discord-command', ReactComponents.DiscordCommand);
export const DiscordComponentsColumn = createReactComponent('discord-components-column', ReactComponents.DiscordComponentsColumn);
export const DiscordContainer = createReactComponent('discord-container', ReactComponents.DiscordContainer);
export const DiscordCustomEmoji = createReactComponent('discord-custom-emoji', ReactComponents.DiscordCustomEmoji);
export const DiscordEmbed = createReactComponent('discord-embed', ReactComponents.DiscordEmbed);
export const DiscordEmbedDescription = createReactComponent('discord-embed-description', ReactComponents.DiscordEmbedDescription);
export const DiscordEmbedField = createReactComponent('discord-embed-field', ReactComponents.DiscordEmbedField);
export const DiscordEmbedFields = createReactComponent('discord-embed-fields', ReactComponents.DiscordEmbedFields);
export const DiscordEmbedFooter = createReactComponent('discord-embed-footer', ReactComponents.DiscordEmbedFooter);
export const DiscordFileAttachment = createReactComponent('discord-file-attachment', ReactComponents.DiscordFileAttachment);
export const DiscordHeader = createReactComponent('discord-header', ReactComponents.DiscordHeader);
export const DiscordImageAttachment = createReactComponent('discord-image-attachment', ReactComponents.DiscordImageAttachment);
export const DiscordInputText = createReactComponent('discord-input-text', ReactComponents.DiscordInputText);
export const DiscordInvite = createReactComponent('discord-invite', ReactComponents.DiscordInvite);
export const DiscordItalic = createReactComponent('discord-italic', ReactComponents.DiscordItalic);
export const DiscordLink = createReactComponent('discord-link', ReactComponents.DiscordLink);
export const DiscordListItem = createReactComponent('discord-list-item', ReactComponents.DiscordListItem);
export const DiscordMediaGallery = createReactComponent('discord-media-gallery', ReactComponents.DiscordMediaGallery);
export const DiscordMediaGalleryItem = createReactComponent('discord-media-gallery-tem', ReactComponents.DiscordMediaGalleryItem);
export const DiscordMediaSpoileableCover = createReactComponent('discord-media-spoileable-cover', ReactComponents.DiscordMediaSpoileableCover);
export const DiscordMention = createReactComponent('discord-mention', ReactComponents.DiscordMention);
export const DiscordMessage = createReactComponent('discord-message', ReactComponents.DiscordMessage);
export const DiscordMessages = createReactComponent('discord-messages', ReactComponents.DiscordMessages);
export const DiscordModal = createReactComponent('discord-modal', ReactComponents.DiscordModal);
export const DiscordOrderedList = createReactComponent('discord-ordered-list', ReactComponents.DiscordOrderedList);
export const DiscordPoll = createReactComponent('discord-poll', ReactComponents.DiscordPoll);
export const DiscordPollAnswer = createReactComponent('discord-poll-answer', ReactComponents.DiscordPollAnswer);
export const DiscordPre = createReactComponent('discord-pre', ReactComponents.DiscordPre);
export const DiscordQuote = createReactComponent('discord-quote', ReactComponents.DiscordQuote);
export const DiscordReaction = createReactComponent('discord-reaction', ReactComponents.DiscordReaction);
export const DiscordReactions = createReactComponent('discord-reactions', ReactComponents.DiscordReactions);
export const DiscordReply = createReactComponent('discord-reply', ReactComponents.DiscordReply);
export const DiscordSection = createReactComponent('discord-section', ReactComponents.DiscordSection);
export const DiscordSectionComponents = createReactComponent('discord-section-components', ReactComponents.DiscordSectionComponents);
export const DiscordSeparator = createReactComponent('discord-separator', ReactComponents.DiscordSeparator);
export const DiscordSpoiler = createReactComponent('discord-spoiler', ReactComponents.DiscordSpoiler);
export const DiscordStringSelectMenu = createReactComponent('discord-string-select-menu', ReactComponents.DiscordStringSelectMenu);
export const DiscordStringSelectMenuOption = createReactComponent('discord-string-select-menu-option', ReactComponents.DiscordStringSelectMenuOption);
export const DiscordSubscript = createReactComponent('discord-subscript', ReactComponents.DiscordSubscript);
export const DiscordSystemMessage = createReactComponent('discord-system-message', ReactComponents.DiscordSystemMessage);
export const DiscordTenorVideo = createReactComponent('discord-tenor-video', ReactComponents.DiscordTenorVideo);
export const DiscordTextDisplay = createReactComponent('discord-text-display', ReactComponents.DiscordTextDisplay);
export const DiscordThread = createReactComponent('discord-thread', ReactComponents.DiscordThread);
export const DiscordThreadMessage = createReactComponent('discord-thread-message', ReactComponents.DiscordThreadMessage);
export const DiscordThumbnail = createReactComponent('discord-thumbnail', ReactComponents.DiscordThumbnail);
export const DiscordTime = createReactComponent('discord-time', ReactComponents.DiscordTime);
export const DiscordUnderlined = createReactComponent('discord-underlined', ReactComponents.DiscordUnderlined);
export const DiscordUnorderedList = createReactComponent('discord-unordered-list', ReactComponents.DiscordUnorderedList);
export const DiscordVerifiedAuthorTag = createReactComponent('discord-verified-author-tag', ReactComponents.DiscordVerifiedAuthorTag);
export const DiscordVideoAttachment = createReactComponent('discord-video-attachment', ReactComponents.DiscordVideoAttachment);

/* IMPORTS END */

export { getConfig, setConfig } from '@penwin/discord-components-core';
export type { Avatars, DiscordMessageOptions, DiscordTimestamp, Emoji, LightTheme, Profile } from '@penwin/discord-components-core';

declare global {
	// eslint-disable-next-line vars-on-top
	var $discordMessage: ReactComponents.DiscordMessageOptions | undefined;
}
