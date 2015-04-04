package com.witbooking.admin.web.rest;

import com.witbooking.admin.Application;
import com.witbooking.admin.domain.BookingEngine;
import com.witbooking.admin.repository.BookingEngineRepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BookingEngineResource REST controller.
 *
 * @see BookingEngineResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class BookingEngineResourceTest {

    private static final String DEFAULT_TICKER = "SAMPLE_TEXT";
    private static final String UPDATED_TICKER = "UPDATED_TEXT";
    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";

    @Inject
    private BookingEngineRepository bookingEngineRepository;

    private MockMvc restBookingEngineMockMvc;

    private BookingEngine bookingEngine;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        BookingEngineResource bookingEngineResource = new BookingEngineResource();
        ReflectionTestUtils.setField(bookingEngineResource, "bookingEngineRepository", bookingEngineRepository);
        this.restBookingEngineMockMvc = MockMvcBuilders.standaloneSetup(bookingEngineResource).build();
    }

    @Before
    public void initTest() {
        bookingEngine = new BookingEngine();
        bookingEngine.setTicker(DEFAULT_TICKER);
        bookingEngine.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createBookingEngine() throws Exception {
        int databaseSizeBeforeCreate = bookingEngineRepository.findAll().size();

        // Create the BookingEngine
        restBookingEngineMockMvc.perform(post("/api/bookingEngines")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(bookingEngine)))
                .andExpect(status().isCreated());

        // Validate the BookingEngine in the database
        List<BookingEngine> bookingEngines = bookingEngineRepository.findAll();
        assertThat(bookingEngines).hasSize(databaseSizeBeforeCreate + 1);
        BookingEngine testBookingEngine = bookingEngines.get(bookingEngines.size() - 1);
        assertThat(testBookingEngine.getTicker()).isEqualTo(DEFAULT_TICKER);
        assertThat(testBookingEngine.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void checkTickerIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(bookingEngineRepository.findAll()).hasSize(0);
        // set the field null
        bookingEngine.setTicker(null);

        // Create the BookingEngine, which fails.
        restBookingEngineMockMvc.perform(post("/api/bookingEngines")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(bookingEngine)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<BookingEngine> bookingEngines = bookingEngineRepository.findAll();
        assertThat(bookingEngines).hasSize(0);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(bookingEngineRepository.findAll()).hasSize(0);
        // set the field null
        bookingEngine.setName(null);

        // Create the BookingEngine, which fails.
        restBookingEngineMockMvc.perform(post("/api/bookingEngines")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(bookingEngine)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<BookingEngine> bookingEngines = bookingEngineRepository.findAll();
        assertThat(bookingEngines).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllBookingEngines() throws Exception {
        // Initialize the database
        bookingEngineRepository.saveAndFlush(bookingEngine);

        // Get all the bookingEngines
        restBookingEngineMockMvc.perform(get("/api/bookingEngines"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(bookingEngine.getId().intValue())))
                .andExpect(jsonPath("$.[*].ticker").value(hasItem(DEFAULT_TICKER.toString())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getBookingEngine() throws Exception {
        // Initialize the database
        bookingEngineRepository.saveAndFlush(bookingEngine);

        // Get the bookingEngine
        restBookingEngineMockMvc.perform(get("/api/bookingEngines/{id}", bookingEngine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(bookingEngine.getId().intValue()))
            .andExpect(jsonPath("$.ticker").value(DEFAULT_TICKER.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBookingEngine() throws Exception {
        // Get the bookingEngine
        restBookingEngineMockMvc.perform(get("/api/bookingEngines/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBookingEngine() throws Exception {
        // Initialize the database
        bookingEngineRepository.saveAndFlush(bookingEngine);
		
		int databaseSizeBeforeUpdate = bookingEngineRepository.findAll().size();

        // Update the bookingEngine
        bookingEngine.setTicker(UPDATED_TICKER);
        bookingEngine.setName(UPDATED_NAME);
        restBookingEngineMockMvc.perform(put("/api/bookingEngines")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(bookingEngine)))
                .andExpect(status().isOk());

        // Validate the BookingEngine in the database
        List<BookingEngine> bookingEngines = bookingEngineRepository.findAll();
        assertThat(bookingEngines).hasSize(databaseSizeBeforeUpdate);
        BookingEngine testBookingEngine = bookingEngines.get(bookingEngines.size() - 1);
        assertThat(testBookingEngine.getTicker()).isEqualTo(UPDATED_TICKER);
        assertThat(testBookingEngine.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteBookingEngine() throws Exception {
        // Initialize the database
        bookingEngineRepository.saveAndFlush(bookingEngine);
		
		int databaseSizeBeforeDelete = bookingEngineRepository.findAll().size();

        // Get the bookingEngine
        restBookingEngineMockMvc.perform(delete("/api/bookingEngines/{id}", bookingEngine.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<BookingEngine> bookingEngines = bookingEngineRepository.findAll();
        assertThat(bookingEngines).hasSize(databaseSizeBeforeDelete - 1);
    }
}
