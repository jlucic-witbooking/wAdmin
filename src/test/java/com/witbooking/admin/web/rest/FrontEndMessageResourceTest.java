package com.witbooking.admin.web.rest;

import com.witbooking.admin.Application;
import com.witbooking.admin.domain.FrontEndMessage;
import com.witbooking.admin.repository.FrontEndMessageRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the FrontEndMessageResource REST controller.
 *
 * @see FrontEndMessageResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class FrontEndMessageResourceTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    private static final String DEFAULT_USERNAME = "SAMPLE_TEXT";
    private static final String UPDATED_USERNAME = "UPDATED_TEXT";
    private static final String DEFAULT_EDITED_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_EDITED_NAME = "UPDATED_TEXT";
    private static final String DEFAULT_DESCRIPTION = "SAMPLE_TEXT";
    private static final String UPDATED_DESCRIPTION = "UPDATED_TEXT";
    private static final String DEFAULT_TITLE = "SAMPLE_TEXT";
    private static final String UPDATED_TITLE = "UPDATED_TEXT";
    private static final String DEFAULT_POSITION = "SAMPLE_TEXT";
    private static final String UPDATED_POSITION = "UPDATED_TEXT";
    private static final String DEFAULT_TYPE = "SAMPLE_TEXT";
    private static final String UPDATED_TYPE = "UPDATED_TEXT";

    private static final Boolean DEFAULT_HIDDEN = false;
    private static final Boolean UPDATED_HIDDEN = true;

    private static final Boolean DEFAULT_UNAVAILABLE = false;
    private static final Boolean UPDATED_UNAVAILABLE = true;

    private static final DateTime DEFAULT_START = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_START = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_START_STR = dateTimeFormatter.print(DEFAULT_START);

    private static final DateTime DEFAULT_END = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_END = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_END_STR = dateTimeFormatter.print(DEFAULT_END);

    private static final DateTime DEFAULT_CREATION = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_CREATION = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_CREATION_STR = dateTimeFormatter.print(DEFAULT_CREATION);

    private static final DateTime DEFAULT_LAST_MODIFICATION = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_LAST_MODIFICATION = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_LAST_MODIFICATION_STR = dateTimeFormatter.print(DEFAULT_LAST_MODIFICATION);

    @Inject
    private FrontEndMessageRepository frontEndMessageRepository;

    private MockMvc restFrontEndMessageMockMvc;

    private FrontEndMessage frontEndMessage;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        FrontEndMessageResource frontEndMessageResource = new FrontEndMessageResource();
        ReflectionTestUtils.setField(frontEndMessageResource, "frontEndMessageRepository", frontEndMessageRepository);
        this.restFrontEndMessageMockMvc = MockMvcBuilders.standaloneSetup(frontEndMessageResource).build();
    }

    @Before
    public void initTest() {
        frontEndMessage = new FrontEndMessage();
        frontEndMessage.setUsername(DEFAULT_USERNAME);
        frontEndMessage.setEditedName(DEFAULT_EDITED_NAME);
        frontEndMessage.setDescription(DEFAULT_DESCRIPTION);
        frontEndMessage.setTitle(DEFAULT_TITLE);
        frontEndMessage.setPosition(DEFAULT_POSITION);
        frontEndMessage.setType(DEFAULT_TYPE);
        frontEndMessage.setHidden(DEFAULT_HIDDEN);
        frontEndMessage.setUnavailable(DEFAULT_UNAVAILABLE);
        frontEndMessage.setStart(DEFAULT_START);
        frontEndMessage.setEnd(DEFAULT_END);
        frontEndMessage.setCreation(DEFAULT_CREATION);
        frontEndMessage.setLastModification(DEFAULT_LAST_MODIFICATION);
    }

    @Test
    @Transactional
    public void createFrontEndMessage() throws Exception {
        int databaseSizeBeforeCreate = frontEndMessageRepository.findAll().size();

        // Create the FrontEndMessage
        restFrontEndMessageMockMvc.perform(post("/api/frontEndMessages")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(frontEndMessage)))
                .andExpect(status().isCreated());

        // Validate the FrontEndMessage in the database
        List<FrontEndMessage> frontEndMessages = frontEndMessageRepository.findAll();
        assertThat(frontEndMessages).hasSize(databaseSizeBeforeCreate + 1);
        FrontEndMessage testFrontEndMessage = frontEndMessages.get(frontEndMessages.size() - 1);
        assertThat(testFrontEndMessage.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testFrontEndMessage.getEditedName()).isEqualTo(DEFAULT_EDITED_NAME);
        assertThat(testFrontEndMessage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testFrontEndMessage.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testFrontEndMessage.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testFrontEndMessage.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFrontEndMessage.getHidden()).isEqualTo(DEFAULT_HIDDEN);
        assertThat(testFrontEndMessage.getUnavailable()).isEqualTo(DEFAULT_UNAVAILABLE);
        assertThat(testFrontEndMessage.getStart().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_START);
        assertThat(testFrontEndMessage.getEnd().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_END);
        assertThat(testFrontEndMessage.getCreation().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_CREATION);
        assertThat(testFrontEndMessage.getLastModification().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_LAST_MODIFICATION);
    }

    @Test
    @Transactional
    public void checkUsernameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(frontEndMessageRepository.findAll()).hasSize(0);
        // set the field null
        frontEndMessage.setUsername(null);

        // Create the FrontEndMessage, which fails.
        restFrontEndMessageMockMvc.perform(post("/api/frontEndMessages")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(frontEndMessage)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<FrontEndMessage> frontEndMessages = frontEndMessageRepository.findAll();
        assertThat(frontEndMessages).hasSize(0);
    }

    @Test
    @Transactional
    public void checkEditedNameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(frontEndMessageRepository.findAll()).hasSize(0);
        // set the field null
        frontEndMessage.setEditedName(null);

        // Create the FrontEndMessage, which fails.
        restFrontEndMessageMockMvc.perform(post("/api/frontEndMessages")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(frontEndMessage)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<FrontEndMessage> frontEndMessages = frontEndMessageRepository.findAll();
        assertThat(frontEndMessages).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllFrontEndMessages() throws Exception {
        // Initialize the database
        frontEndMessageRepository.saveAndFlush(frontEndMessage);

        // Get all the frontEndMessages
        restFrontEndMessageMockMvc.perform(get("/api/frontEndMessages"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(frontEndMessage.getId().intValue())))
                .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME.toString())))
                .andExpect(jsonPath("$.[*].editedName").value(hasItem(DEFAULT_EDITED_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
                .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
                .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION.toString())))
                .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
                .andExpect(jsonPath("$.[*].hidden").value(hasItem(DEFAULT_HIDDEN.booleanValue())))
                .andExpect(jsonPath("$.[*].unavailable").value(hasItem(DEFAULT_UNAVAILABLE.booleanValue())))
                .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START_STR)))
                .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END_STR)))
                .andExpect(jsonPath("$.[*].creation").value(hasItem(DEFAULT_CREATION_STR)))
                .andExpect(jsonPath("$.[*].lastModification").value(hasItem(DEFAULT_LAST_MODIFICATION_STR)));
    }

    @Test
    @Transactional
    public void getFrontEndMessage() throws Exception {
        // Initialize the database
        frontEndMessageRepository.saveAndFlush(frontEndMessage);

        // Get the frontEndMessage
        restFrontEndMessageMockMvc.perform(get("/api/frontEndMessages/{id}", frontEndMessage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(frontEndMessage.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME.toString()))
            .andExpect(jsonPath("$.editedName").value(DEFAULT_EDITED_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.hidden").value(DEFAULT_HIDDEN.booleanValue()))
            .andExpect(jsonPath("$.unavailable").value(DEFAULT_UNAVAILABLE.booleanValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START_STR))
            .andExpect(jsonPath("$.end").value(DEFAULT_END_STR))
            .andExpect(jsonPath("$.creation").value(DEFAULT_CREATION_STR))
            .andExpect(jsonPath("$.lastModification").value(DEFAULT_LAST_MODIFICATION_STR));
    }

    @Test
    @Transactional
    public void getNonExistingFrontEndMessage() throws Exception {
        // Get the frontEndMessage
        restFrontEndMessageMockMvc.perform(get("/api/frontEndMessages/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFrontEndMessage() throws Exception {
        // Initialize the database
        frontEndMessageRepository.saveAndFlush(frontEndMessage);
		
		int databaseSizeBeforeUpdate = frontEndMessageRepository.findAll().size();

        // Update the frontEndMessage
        frontEndMessage.setUsername(UPDATED_USERNAME);
        frontEndMessage.setEditedName(UPDATED_EDITED_NAME);
        frontEndMessage.setDescription(UPDATED_DESCRIPTION);
        frontEndMessage.setTitle(UPDATED_TITLE);
        frontEndMessage.setPosition(UPDATED_POSITION);
        frontEndMessage.setType(UPDATED_TYPE);
        frontEndMessage.setHidden(UPDATED_HIDDEN);
        frontEndMessage.setUnavailable(UPDATED_UNAVAILABLE);
        frontEndMessage.setStart(UPDATED_START);
        frontEndMessage.setEnd(UPDATED_END);
        frontEndMessage.setCreation(UPDATED_CREATION);
        frontEndMessage.setLastModification(UPDATED_LAST_MODIFICATION);
        restFrontEndMessageMockMvc.perform(put("/api/frontEndMessages")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(frontEndMessage)))
                .andExpect(status().isOk());

        // Validate the FrontEndMessage in the database
        List<FrontEndMessage> frontEndMessages = frontEndMessageRepository.findAll();
        assertThat(frontEndMessages).hasSize(databaseSizeBeforeUpdate);
        FrontEndMessage testFrontEndMessage = frontEndMessages.get(frontEndMessages.size() - 1);
        assertThat(testFrontEndMessage.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testFrontEndMessage.getEditedName()).isEqualTo(UPDATED_EDITED_NAME);
        assertThat(testFrontEndMessage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testFrontEndMessage.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testFrontEndMessage.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testFrontEndMessage.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFrontEndMessage.getHidden()).isEqualTo(UPDATED_HIDDEN);
        assertThat(testFrontEndMessage.getUnavailable()).isEqualTo(UPDATED_UNAVAILABLE);
        assertThat(testFrontEndMessage.getStart().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_START);
        assertThat(testFrontEndMessage.getEnd().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_END);
        assertThat(testFrontEndMessage.getCreation().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_CREATION);
        assertThat(testFrontEndMessage.getLastModification().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_LAST_MODIFICATION);
    }

    @Test
    @Transactional
    public void deleteFrontEndMessage() throws Exception {
        // Initialize the database
        frontEndMessageRepository.saveAndFlush(frontEndMessage);
		
		int databaseSizeBeforeDelete = frontEndMessageRepository.findAll().size();

        // Get the frontEndMessage
        restFrontEndMessageMockMvc.perform(delete("/api/frontEndMessages/{id}", frontEndMessage.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<FrontEndMessage> frontEndMessages = frontEndMessageRepository.findAll();
        assertThat(frontEndMessages).hasSize(databaseSizeBeforeDelete - 1);
    }
}
